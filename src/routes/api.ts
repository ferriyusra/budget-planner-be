import express, { Request, Response, NextFunction, Router } from 'express';

import AuthController from '../modules/controllers/auth.controller';
import CampaignController from '../modules/controllers/campaign.controller';
import CategoryController from '../modules/controllers/category.controller';
import DonationController from '../modules/controllers/donation.controller';

import aclMiddleware from '../middlewares/acl.middleware';
import authMiddleware from '../middlewares/auth.middleware';
import mediaMiddleware from '../middlewares/media.middleware';

import { ROLES } from '../utils/constant';
import { IReqUser } from '../utils/interfaces';
import { MediaController } from '../modules/controllers/media.controller';

export class ApiRouter {
	private router: Router;
	private authController: AuthController;
	private categoryController: CategoryController;
	private campaignController: CampaignController;
	private donationController: DonationController;
	private mediaController: MediaController;

	constructor(
		authController: AuthController,
		categoryController: CategoryController,
		campaignController: CampaignController,
		donationController: DonationController,
		mediaController: MediaController
	) {
		this.router = express.Router();
		this.authController = authController;
		this.categoryController = categoryController;
		this.campaignController = campaignController;
		this.donationController = donationController;
		this.mediaController = mediaController;
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
			'/auth/activation',
			authMiddleware,
			(req: Request, res: Response, _next: NextFunction) =>
				this.authController.activation(req, res)
		);

		// Category Route
		this.router.post(
			'/category',
			[authMiddleware, aclMiddleware([ROLES.ADMIN])],
			(req: IReqUser, res: Response, _next: NextFunction) =>
				this.categoryController.create(req, res)
			/*
          #swagger.tags = ['Category']
          #swagger.security = [{
            "bearerAuth": {}
          }]
          #swagger.requestBody = {
            required: true,
            schema: {
              $ref: '#/components/schemas/CreateCategoryRequest'
            }
          }
          */
		);
		this.router.get(
			'/category',
			(req: IReqUser, res: Response, _next: NextFunction) =>
				this.categoryController.findAll(req, res)
		);
		this.router.get(
			'/category/:id',
			(req: IReqUser, res: Response, _next: NextFunction) =>
				this.categoryController.findOne(req, res)
		);
		this.router.put(
			'/category/:id',
			[authMiddleware, aclMiddleware([ROLES.ADMIN])],
			(req: IReqUser, res: Response, _next: NextFunction) =>
				this.categoryController.update(req, res)
		);
		this.router.delete(
			'/category/:id',
			[authMiddleware, aclMiddleware([ROLES.ADMIN])],
			(req: IReqUser, res: Response, _next: NextFunction) =>
				this.categoryController.remove(req, res)
		);

		// Campaign Route
		this.router.post(
			'/campaign',
			[authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.FUNDRAISER])],
			(req: IReqUser, res: Response, _next: NextFunction) =>
				this.campaignController.create(req, res)
		);
		this.router.get(
			'/campaign',
			(req: IReqUser, res: Response, _next: NextFunction) =>
				this.campaignController.findAll(req, res)
		);
		this.router.get(
			'/campaign/:id',
			(req: IReqUser, res: Response, _next: NextFunction) =>
				this.campaignController.findOne(req, res)
		);
		this.router.get(
			'/campaign-approved',
			(req: IReqUser, res: Response, _next: NextFunction) =>
				this.campaignController.findAllByStatusApproved(req, res)
		);
		this.router.get(
			'/campaign-approved/:id',
			(req: IReqUser, res: Response, _next: NextFunction) =>
				this.campaignController.findOneByStatusApproved(req, res)
		);
		this.router.get(
			'/campaign/:campaignSlug/slug',
			(req: IReqUser, res: Response, _next: NextFunction) =>
				this.campaignController.findOneBySlug(req, res)
		);
		this.router.put(
			'/campaign/:id',
			[authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.FUNDRAISER])],
			(req: IReqUser, res: Response, _next: NextFunction) =>
				this.campaignController.update(req, res)
		);
		this.router.delete(
			'/campaign/:id',
			[authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.FUNDRAISER])],
			(req: IReqUser, res: Response, _next: NextFunction) =>
				this.campaignController.remove(req, res)
		);

		// Donation Route
		this.router.post(
			'/donation/:campaignSlug',
			(req: IReqUser, res: Response, _next: NextFunction) =>
				this.donationController.create(req, res)
		);
		this.router.put(
			'/donation/:donationId/complete',
			(req: IReqUser, res: Response, _next: NextFunction) =>
				this.donationController.complete(req, res)
		);
		this.router.get(
			'/donation-history/:campaignId',
			(req: IReqUser, res: Response, _next: NextFunction) =>
				this.donationController.findAllDonationByCampaign(req, res)
		);

		// Media Route
		this.router.post(
			'/media/upload-single',
			[authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.FUNDRAISER])],
			mediaMiddleware.single('file'),
			(req: IReqUser, res: Response, _next: NextFunction) =>
				this.mediaController.single(req, res)
		);

		this.router.post(
			'/media/upload-multiple',
			[authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.FUNDRAISER])],
			mediaMiddleware.single('files'),
			(req: IReqUser, res: Response, _next: NextFunction) =>
				this.mediaController.multiple(req, res)
		);

		this.router.delete(
			'/media/remove',
			[authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.FUNDRAISER])],
			(req: IReqUser, res: Response, _next: NextFunction) =>
				this.mediaController.remove(req, res)
		);
	}

	public getRouter(): Router {
		return this.router;
	}
}

export default (
	authController: AuthController,
	categoryController: CategoryController,
	campaignController: CampaignController,
	donationController: DonationController,
	mediaController: MediaController
): Router => {
	return new ApiRouter(
		authController,
		categoryController,
		campaignController,
		donationController,
		mediaController
	).getRouter();
};
