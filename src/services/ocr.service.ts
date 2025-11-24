import Tesseract from 'tesseract.js';
import fs from 'fs';

interface ExtractedData {
    storeName?: string;
    purchaseDate?: Date;
    totalAmount?: number;
    items: { name: string; quantity?: number; price?: number }[];
    rawText: string;
}

export const processReceipt = async (imagePath: string): Promise<ExtractedData> => {
    const result: any = await Tesseract.recognize(imagePath, 'eng');
    const text = result.data.text;

    console.log('Extracted Text:', text);

    const lines = text.split('\n').map((line: string) => line.trim()).filter((line: string) => line.length > 0);

    let storeName = lines[0]; // Naive assumption: first line is store name
    let totalAmount: number | undefined;
    let purchaseDate: Date | undefined;
    const items: { name: string; quantity?: number; price?: number }[] = [];

    // Regex patterns
    const datePattern = /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})|(\d{4}[-\/]\d{1,2}[-\/]\d{1,2})/;
    const totalPattern = /(?:TOTAL|AMOUNT|DUE)[\s:]*[$€£]?\s*(\d+\.\d{2})/i;
    const pricePattern = /(\d+\.\d{2})$/;

    for (const line of lines) {
        // Date extraction
        if (!purchaseDate) {
            const dateMatch = line.match(datePattern);
            if (dateMatch) {
                const dateStr = dateMatch[0];
                const parsedDate = new Date(dateStr);
                if (!isNaN(parsedDate.getTime())) {
                    purchaseDate = parsedDate;
                }
            }
        }

        // Total extraction
        if (!totalAmount) {
            const totalMatch = line.match(totalPattern);
            if (totalMatch) {
                totalAmount = parseFloat(totalMatch[1]);
            }
        }

        // Item extraction (very basic heuristic)
        // Assuming lines with a price at the end are items
        const priceMatch = line.match(pricePattern);
        if (priceMatch && !line.match(/TOTAL|SUBTOTAL|TAX|CASH|CHANGE/i)) {
            const price = parseFloat(priceMatch[1]);
            const name = line.replace(pricePattern, '').trim();
            if (name.length > 0) {
                items.push({ name, price, quantity: 1 });
            }
        }
    }

    return {
        storeName,
        purchaseDate,
        totalAmount,
        items,
        rawText: text
    };
};
