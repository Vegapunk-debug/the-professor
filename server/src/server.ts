import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import compression from 'compression';
import apiRouter from './routes/api';
import { IDatabase } from './interfaces/IDatabase';
import { MongoDatabase } from './config/MongoDatabase';

export class AppServer {
    public app: express.Application;
    private port: string | number;
    private database: IDatabase;

    constructor(database: IDatabase) {
        this.app = express();
        this.port = process.env.PORT || 5000;
        this.database = database;

        this.initializeMiddlewares();
        this.initializeRoutes();
    }

    private initializeMiddlewares(): void {
        this.app.use(cors());
        this.app.use(compression());
        this.app.use(express.json({ limit: '50mb' }));
    }

    private initializeRoutes(): void {
        this.app.use('/api', apiRouter);

        this.app.get('/', (req, res) => {
            res.send('The Professor API is Live Now');
        });

        // Global Error Handler
        this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            console.error(`[ERROR] ${new Date().toISOString()}:`, err.stack || err.message);
            res.status(err.status || 500).json({
                error: err.message || "Internal Server Error",
                timestamp: new Date().toISOString()
            });
        });
    }

    public async start(): Promise<void> {
        try {
            await this.database.connect();

            this.app.listen(this.port, () => {
                console.log(`[READY] The Professor API is live at http://localhost:${this.port}`);
            });
        } catch (err: any) {
            console.error('Failed to start server due to database connection issue:', err.message);
            process.exit(1);
        }
    }
}

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/the-professor';
const mongoDb = new MongoDatabase(mongoUri);

const server = new AppServer(mongoDb);
server.start();