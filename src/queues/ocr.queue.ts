import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis.js';

export interface OcrJobData {
    receiptId: string;
    imagePath: string;
}

export const ocrQueue = new Queue<OcrJobData>('ocr-processing', {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
        removeOnComplete: {
            count: 100,
        },
        removeOnFail: {
            count: 50,
        },
    },
});

console.log('📋 OCR Queue initialized');
