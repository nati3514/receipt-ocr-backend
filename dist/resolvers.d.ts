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
                quantity: number | null;
                price: number | null;
                receiptId: string;
            }[];
        } & {
            storeName: string | null;
            purchaseDate: Date | null;
            totalAmount: number | null;
            rawText: string | null;
            id: string;
            imageUrl: string;
            createdAt: Date;
        })[]>;
        receipt: (_: any, { id }: {
            id: string;
        }) => Promise<({
            items: {
                id: string;
                name: string;
                quantity: number | null;
                price: number | null;
                receiptId: string;
            }[];
        } & {
            storeName: string | null;
            purchaseDate: Date | null;
            totalAmount: number | null;
            rawText: string | null;
            id: string;
            imageUrl: string;
            createdAt: Date;
        }) | null>;
    };
    Mutation: {
        uploadReceipt: (_: any, { file }: {
            file: any;
        }) => Promise<{
            items: {
                id: string;
                name: string;
                quantity: number | null;
                price: number | null;
                receiptId: string;
            }[];
        } & {
            storeName: string | null;
            purchaseDate: Date | null;
            totalAmount: number | null;
            rawText: string | null;
            id: string;
            imageUrl: string;
            createdAt: Date;
        }>;
    };
};
//# sourceMappingURL=resolvers.d.ts.map