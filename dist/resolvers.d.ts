export declare const resolvers: {
    Upload: {
        parseValue(value: any): any;
        name: string;
        description: import("graphql/jsutils/Maybe.js").Maybe<string>;
        specifiedByURL: import("graphql/jsutils/Maybe.js").Maybe<string>;
        serialize: import("graphql").GraphQLScalarSerializer<never>;
        parseLiteral: import("graphql").GraphQLScalarLiteralParser<Promise<import("graphql-upload-ts").FileUpload>>;
        extensions: Readonly<import("graphql").GraphQLScalarTypeExtensions>;
        astNode: import("graphql/jsutils/Maybe.js").Maybe<import("graphql").ScalarTypeDefinitionNode>;
        extensionASTNodes: ReadonlyArray<import("graphql").ScalarTypeExtensionNode>;
    };
    Query: {
        receipts: (_: any, { filter }: {
            filter?: {
                storeName?: string;
                startDate?: Date;
                endDate?: Date;
            };
        }) => Promise<({
            items: {
                id: string;
                name: string;
                receiptId: string;
                quantity: number | null;
                price: number | null;
            }[];
        } & {
            id: string;
            storeName: string | null;
            purchaseDate: Date | null;
            totalAmount: number | null;
            imageUrl: string;
            rawText: string | null;
            status: string;
            errorMessage: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[]>;
        receipt: (_: any, { id }: {
            id: string;
        }) => Promise<({
            items: {
                id: string;
                name: string;
                receiptId: string;
                quantity: number | null;
                price: number | null;
            }[];
        } & {
            id: string;
            storeName: string | null;
            purchaseDate: Date | null;
            totalAmount: number | null;
            imageUrl: string;
            rawText: string | null;
            status: string;
            errorMessage: string | null;
            createdAt: Date;
            updatedAt: Date;
        }) | null>;
        receiptStatus: (_: any, { id }: {
            id: string;
        }) => Promise<({
            items: {
                id: string;
                name: string;
                receiptId: string;
                quantity: number | null;
                price: number | null;
            }[];
        } & {
            id: string;
            storeName: string | null;
            purchaseDate: Date | null;
            totalAmount: number | null;
            imageUrl: string;
            rawText: string | null;
            status: string;
            errorMessage: string | null;
            createdAt: Date;
            updatedAt: Date;
        }) | null>;
    };
    Mutation: {
        uploadReceipt: (_: any, { file }: {
            file: any;
        }) => Promise<{
            items: {
                id: string;
                name: string;
                receiptId: string;
                quantity: number | null;
                price: number | null;
            }[];
        } & {
            id: string;
            storeName: string | null;
            purchaseDate: Date | null;
            totalAmount: number | null;
            imageUrl: string;
            rawText: string | null;
            status: string;
            errorMessage: string | null;
            createdAt: Date;
            updatedAt: Date;
        }>;
        retryReceipt: (_: any, { id }: {
            id: string;
        }) => Promise<({
            items: {
                id: string;
                name: string;
                receiptId: string;
                quantity: number | null;
                price: number | null;
            }[];
        } & {
            id: string;
            storeName: string | null;
            purchaseDate: Date | null;
            totalAmount: number | null;
            imageUrl: string;
            rawText: string | null;
            status: string;
            errorMessage: string | null;
            createdAt: Date;
            updatedAt: Date;
        }) | null>;
    };
};
//# sourceMappingURL=resolvers.d.ts.map