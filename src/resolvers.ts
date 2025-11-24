import { PrismaClient } from '@prisma/client';
import { GraphQLUpload } from 'graphql-upload-ts';
import { processReceipt } from './services/ocr.service.js';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Custom Upload scalar that accepts the processed upload object
const CustomUpload = {
    ...GraphQLUpload,
    parseValue(value: any) {
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
        receipts: async () => {
            return prisma.receipt.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' } });
        },
        receipt: async (_: any, { id }: { id: string }) => {
            return prisma.receipt.findUnique({ where: { id }, include: { items: true } });
        },
    },
    Mutation: {
        uploadReceipt: async (_: any, { file }: { file: any }) => {
            // The file is already processed by graphqlUploadExpress middleware
            const { createReadStream, filename, mimetype, encoding } = await file;

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

            console.log(`File uploaded: ${filePath}`);

            const receiptData = await processReceipt(filePath);

            const receipt = await prisma.receipt.create({
                data: {
                    storeName: receiptData.storeName,
                    purchaseDate: receiptData.purchaseDate,
                    totalAmount: receiptData.totalAmount,
                    imageUrl: `/uploads/${uniqueFilename}`,
                    items: {
                        create: receiptData.items.map((item: any) => ({
                            name: item.name,
                            price: item.price,
                            quantity: item.quantity || 1,
                        })),
                    },
                },
                include: { items: true },
            });

            return receipt;
        },
    },
};
