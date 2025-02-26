import express, { Request, Response, NextFunction, Router } from 'express';
import aclMiddleware from '../middlewares/acl.middleware';
import authMiddleware from '../middlewares/auth.middleware';
import { ROLES } from '../utils/constant';
import { IReqUser } from '../utils/interfaces';
import CampaignController from '../modules/controllers/campaign.controller';

export class CampaignRouter {
	private router: Router;
	private campaignController: CampaignController;

	constructor(campaignController: CampaignController) {
		this.router = express.Router();
		this.campaignController = campaignController;
		this.initializeRoutes();
	}

	private initializeRoutes(): void {
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
	}

	public getRouter(): Router {
		return this.router;
	}
}

export default (campaignController: CampaignController): Router => {
	return new CampaignRouter(campaignController).getRouter();
};
