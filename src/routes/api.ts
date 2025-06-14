import express, { Request, Response, NextFunction, Router } from 'express';

import AuthController from '../modules/controllers/auth.controller';
import SimulationKprController from '../modules/controllers/simulation_kpr.controller';

import aclMiddleware from '../middlewares/acl.middleware';
import authMiddleware from '../middlewares/auth.middleware';

import { ROLES } from '../utils/constant';
import { IReqUser } from '../utils/interfaces';

export class ApiRouter {
	private router: Router;
	private authController: AuthController;
	private simulationKprController: SimulationKprController;

	constructor(
		authController: AuthController,
		simulationKprController: SimulationKprController
	) {
		this.router = express.Router();
		this.authController = authController;
		this.simulationKprController = simulationKprController;
		this.initializeRoutes();
	}

	private initializeRoutes(): void {
		// Auth Route
		this.router.post(
			'/auth/register',
			(req: Request, res: Response, _next: NextFunction) =>
				this.authController.register(req, res)
			/*
			#swagger.tags = ['Auth']
			#swagger.requestBody = {
				required: true,
				schema: {$ref: '#/components/schemas/RegisterRequest'}
			}
			*/
		);

		this.router.post(
			'/auth/login',
			(req: Request, res: Response, _next: NextFunction) =>
				this.authController.login(req, res)
			/*
			#swagger.tags = ['Auth']
			#swagger.requestBody = {
				required: true,
				schema: {$ref: '#/components/schemas/LoginRequest'}
			}
			*/
		);

		this.router.get(
			'/auth/me',
			authMiddleware,
			(req: Request, res: Response, _next: NextFunction) =>
				this.authController.me(req, res)
		);

		this.router.post(
			'/simulation-kpr',
			[authMiddleware, aclMiddleware([ROLES.USER, ROLES.ADMIN])],
			(req: Request, res: Response, _next: NextFunction) =>
				this.simulationKprController.create(req, res)
		);

		this.router.get(
			'/simulation-kpr',
			[authMiddleware, aclMiddleware([ROLES.USER, ROLES.ADMIN])],
			(req: Request, res: Response, _next: NextFunction) =>
				this.simulationKprController.findAll(req, res)
		);

		this.router.get(
			'/simulation-kpr/:id',
			[authMiddleware, aclMiddleware([ROLES.USER, ROLES.ADMIN])],
			(req: Request, res: Response, _next: NextFunction) =>
				this.simulationKprController.findById(req, res)
		);

		this.router.get(
			'/simulation-kpr/:id/download',
			[authMiddleware, aclMiddleware([ROLES.USER, ROLES.ADMIN])],
			(req: Request, res: Response, _next: NextFunction) =>
				this.simulationKprController.downloadExcel(req, res)
		);
	}

	public getRouter(): Router {
		return this.router;
	}
}

export default (
	authController: AuthController,
	simulationKprController: SimulationKprController
): Router => {
	return new ApiRouter(authController, simulationKprController).getRouter();
};
