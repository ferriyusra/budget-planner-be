import express, { Request, Response, NextFunction, Router } from 'express';

import AuthController from '../modules/controllers/auth.controller';
import SimulationController from '../modules/controllers/simulation.controller';

import aclMiddleware from '../middlewares/acl.middleware';
import authMiddleware from '../middlewares/auth.middleware';

import { ROLES } from '../utils/constant';
import { IReqUser } from '../utils/interfaces';

export class ApiRouter {
	private router: Router;
	private authController: AuthController;
	private simulationController: SimulationController;

	constructor(
		authController: AuthController,
		simulationController: SimulationController
	) {
		this.router = express.Router();
		this.authController = authController;
		this.simulationController = simulationController;
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
			'/simulation',
			[authMiddleware, aclMiddleware([ROLES.USER, ROLES.ADMIN])],
			(req: Request, res: Response, _next: NextFunction) =>
				this.simulationController.create(req, res)
		);

		this.router.get(
			'/simulation',
			[authMiddleware, aclMiddleware([ROLES.USER, ROLES.ADMIN])],
			(req: Request, res: Response, _next: NextFunction) =>
				this.simulationController.findAll(req, res)
		);

		this.router.get(
			'/simulation/:id',
			[authMiddleware, aclMiddleware([ROLES.USER, ROLES.ADMIN])],
			(req: Request, res: Response, _next: NextFunction) =>
				this.simulationController.findById(req, res)
		);

		this.router.get(
			'/simulation/:id/download',
			[authMiddleware, aclMiddleware([ROLES.USER, ROLES.ADMIN])],
			(req: Request, res: Response, _next: NextFunction) =>
				this.simulationController.downloadExcel(req, res)
		);
	}

	public getRouter(): Router {
		return this.router;
	}
}

export default (
	authController: AuthController,
	simulationController: SimulationController
): Router => {
	return new ApiRouter(authController, simulationController).getRouter();
};
