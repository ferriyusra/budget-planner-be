import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import httpContext from 'express-http-context';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import docs from './docs/route';
import cors from 'cors';
import { connectDatabase } from './utils/database';
import logger from './utils/logger';
import errorMiddleware from './middlewares/error.middleware';
import { APP_ENV, APP_NAME, APP_VERSION } from './utils/env';
import {
	createAuthController,
	createAuthRepository,
	createAuthService,
	createCampaignController,
	createCampaignRepository,
	createCampaignService,
	createCategoryController,
	createCategoryRepository,
	createCategoryService,
	createMediaController,
	createMediaService,
} from './modules';
import authRouter from './routes/auth';
import categoryRouter from './routes/category';
import mediaRouter from './routes/media';
import campaignRouter from './routes/campaign';
import { CloudinaryUploader } from './utils/uploader';
import http from 'http';

// Initialize Express
logger.info('Initializing express');
const app = express();

// Set port
const port: number = Number(process.env.APP_PORT) || 9852;
app.set('port', port);

function onListening(server: http.Server): void {
	const addr = server.address();
	const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
	logger.info(`Listening on ${bind}`);
}

async function main() {
	// Apply middleware
	app.use(helmet());
	app.use(cors());
	app.use(bodyParser.json());
	app.use(express.urlencoded({ extended: false }));

	// Setup logging
	if (app.get('env') !== 'test') {
		app.use(
			morgan((tokens, req: Request, res: Response) => {
				logger.info(
					`morgan ${tokens.method(req, res)} ${tokens.url(
						req,
						res
					)} ${tokens.status(req, res)}`
				);
				return '';
			})
		);
	}

	// Generate request ID for each request
	logger.info('Generating request ID');
	const generateRandomString = (length = 10): string =>
		Math.random().toString(36).substr(2, length);

	app.use(httpContext.middleware);
	app.use((req: Request, _res: Response, next: NextFunction) => {
		const requestId = req.headers['request-id'] as string | undefined;
		if (requestId) {
			(req as any).requestId = requestId;
			httpContext.set('requestId', requestId);
		} else {
			(req as any).requestId = generateRandomString();
			httpContext.set('requestId', (req as any).requestId);
		}
		next();
	});

	// Initialize database
	logger.info('Initializing database');
	const db = await connectDatabase();

	// Initialize dependencies
	logger.info('Initializing dependencies');
	const authRepository = createAuthRepository(db);
	const categoryRepository = createCategoryRepository(db);
	const campaignRepository = createCampaignRepository(db);

	const authService = createAuthService(authRepository);
	const categoryService = createCategoryService(categoryRepository);
	const campaignService = createCampaignService(campaignRepository);
	const mediaService = createMediaService(new CloudinaryUploader());

	const authController = createAuthController(authService);
	const categoryController = createCategoryController(categoryService);
	const campaignController = createCampaignController(campaignService);
	const mediaController = createMediaController(mediaService);

	// Initialize routes
	logger.info('Initializing routes');
	app.use('/api', authRouter(authController));
	app.use('/api', categoryRouter(categoryController));
	app.use('/api', campaignRouter(campaignController));
	app.use('/api', mediaRouter(mediaController));

	// Initialize API documentation
	// Uncomment the line below to enable API documentation
	// docs(app);

	app.get('/', (_req: Request, res: Response) => {
		res.status(200).json({
			message: 'Server is running!',
			data: `${APP_NAME} ${APP_ENV} v${APP_VERSION}.`,
		});
	});

	// Error handling middleware
	app.use(errorMiddleware.serverRoute());
	app.use(errorMiddleware.serverError());

	app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
		if (app.get('env') !== 'test') {
			logger.error('err', err.message);
		}

		res.status(err.status || 500).json({
			message: err.message,
			success: false,
			data: null,
			responseTime: err.responseTime,
			__error__: process.env.NODE_ENV === 'development' ? err.stack : undefined,
		});
	});

	// Start the server after all configurations are done
	const server = http.createServer(app);
	server.listen(port);
	server.on('listening', () => onListening(server));

	logger.info(`${APP_NAME} server started on port ${port}`);
}

main();
export default app;
