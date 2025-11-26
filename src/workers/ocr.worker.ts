import { Worker } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { redisConnection } from '../config/redis.js';
import { processReceipt } from '../services/ocr.service.js';
import type { OcrJobData } from '../queues/ocr.queue.js';

const prisma = new PrismaClient();

export const ocrWorker = new Worker<OcrJobData>(
    'ocr-processing',
    async (job) => {
        const { receiptId, imagePath } = job.data;

        console.log(`🔄 Processing OCR for receipt: ${receiptId}`);

        // Update status to processing
        await prisma.receipt.update({
            where: { id: receiptId },
            data: { status: 'processing' },
        });

        try {
            // Process OCR
            const receiptData = await processReceipt(imagePath);

            // Update receipt with extracted data
            await prisma.receipt.update({
                where: { id: receiptId },
                data: {
                    storeName: receiptData.storeName,
                    purchaseDate: receiptData.purchaseDate,
                    totalAmount: receiptData.totalAmount,
                    rawText: receiptData.rawText,
                    status: 'completed',
                    errorMessage: null,
                    items: {
                        create: receiptData.items.map((item) => ({
                            name: item.name,
                            price: item.price,
                            quantity: item.quantity || 1,
                        })),
                    },
                },
            });

            console.log(`✅ OCR completed for receipt: ${receiptId}`);
            return { success: true, receiptId };
        } catch (error) {
            console.error(`❌ OCR failed for receipt: ${receiptId}`, error);

            // Update status to failed
            await prisma.receipt.update({
                where: { id: receiptId },
                data: {
                    status: 'failed',
                    errorMessage: error instanceof Error ? error.message : 'Unknown error occurred',
                },
            });

            throw error;
        }
    },
    {
        connection: redisConnection,
        concurrency: 5, // Process up to 5 jobs concurrently
    }
);

ocrWorker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed for receipt: ${job.data.receiptId}`);
});

ocrWorker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} failed for receipt: ${job?.data.receiptId}`, err.message);
});

ocrWorker.on('error', (err) => {
    console.error('❌ Worker error:', err);
});

console.log('👷 OCR Worker started with concurrency: 5');
