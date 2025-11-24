import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { resolvers } from './resolvers.js';
import { readFileSync } from 'fs';
import path from 'path';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const typeDefs = readFileSync(path.join(__dirname, 'schema.graphql'), { encoding: 'utf-8' });

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

const startServer = async () => {
    await server.start();

    app.use(
        '/graphql',
        cors<cors.CorsRequest>(),
        // IMPORTANT: Do NOT use express.json() - it conflicts with graphqlUploadExpress
        // graphqlUploadExpress must come BEFORE expressMiddleware
        graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }),
        expressMiddleware(server),
    );

    // Serve uploaded files
    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

    await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
};

startServer();
