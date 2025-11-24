interface ExtractedData {
    storeName?: string;
    purchaseDate?: Date;
    totalAmount?: number;
    items: {
        name: string;
        quantity?: number;
        price?: number;
    }[];
    rawText: string;
}
export declare const processReceipt: (imagePath: string) => Promise<ExtractedData>;
export {};
//# sourceMappingURL=ocr.service.d.ts.map