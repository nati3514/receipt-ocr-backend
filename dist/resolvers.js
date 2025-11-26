import { PrismaClient } from '@prisma/client';
import { GraphQLUpload } from 'graphql-upload-ts';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { ocrQueue } from './queues/ocr.queue.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();
// Custom Upload scalar that accepts the processed upload object
const CustomUpload = {
    ...GraphQLUpload,
    parseValue(value) {
        // If it's already a processed upload object from graphql-upload-ts, return it as-is
        if (value && typeof value === 'object' && value.createReadStream) {
            return value;
        }
        // Otherwise use the default GraphQLUpload parseValue
        return GraphQLUpload.parseValue(value);
    }
};
export const resolvers = {
    Upload: CustomUpload,
    Query: {
        receipts: async (_, { filter }) => {
            const where = {};
            // Filter by store name (case-insensitive partial match)
            if (filter?.storeName) {
                where.storeName = {
                    contains: filter.storeName,
                    mode: 'insensitive'
                };
            }
            // Filter by date range on purchaseDate
            if (filter?.startDate || filter?.endDate) {
                where.purchaseDate = {};
                if (filter.startDate) {
                    where.purchaseDate.gte = new Date(filter.startDate);
                }
                if (filter.endDate) {
                    where.purchaseDate.lte = new Date(filter.endDate);
                }
            }
            return prisma.receipt.findMany({
                where,
                include: { items: true },
                orderBy: { createdAt: 'desc' }
            });
        },
        receipt: async (_, { id }) => {
            return prisma.receipt.findUnique({ where: { id }, include: { items: true } });
        },
        receiptStatus: async (_, { id }) => {
            return prisma.receipt.findUnique({ where: { id }, include: { items: true } });
        },
    },
    Mutation: {
        uploadReceipt: async (_, { file }) => {
            // The file is already processed by graphqlUploadExpress middleware
            const { createReadStream, filename } = await file;
            const stream = createReadStream();
            const uploadDir = path.join(__dirname, '../uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const uniqueFilename = `${uuidv4()}-${filename}`;
            const filePath = path.join(uploadDir, uniqueFilename);
            const writeStream = fs.createWriteStream(filePath);
            await new Promise((resolve, reject) => {
                stream.pipe(writeStream);
                stream.on('end', resolve);
                stream.on('error', reject);
            });
            console.log(`📁 File uploaded: ${filePath}`);
            // Create receipt with pending status
            const receipt = await prisma.receipt.create({
                data: {
                    imageUrl: `/uploads/${uniqueFilename}`,
                    status: 'pending',
                },
                include: { items: true },
            });
            // Add to queue for background processing
            await ocrQueue.add('process-receipt', {
                receiptId: receipt.id,
                imagePath: filePath,
            });
            console.log(`📋 Queued OCR job for receipt: ${receipt.id}`);
            return receipt;
        },
        retryReceipt: async (_, { id }) => {
            const receipt = await prisma.receipt.findUnique({ where: { id } });
            if (!receipt) {
                throw new Error('Receipt not found');
            }
            if (receipt.status !== 'failed') {
                throw new Error('Can only retry failed receipts');
            }
            // Reset status and re-queue
            await prisma.receipt.update({
                where: { id },
                data: { status: 'pending', errorMessage: null },
            });
            const imagePath = path.join(__dirname, '..', receipt.imageUrl);
            await ocrQueue.add('process-receipt', {
                receiptId: receipt.id,
                imagePath,
            });
            console.log(`🔄 Retrying OCR for receipt: ${id}`);
            return prisma.receipt.findUnique({ where: { id }, include: { items: true } });
        },
    },
};
//# sourceMappingURL=resolvers.js.map