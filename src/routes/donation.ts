import express, { Response, NextFunction, Router } from 'express';
import aclMiddleware from '../middlewares/acl.middleware';
import authMiddleware from '../middlewares/auth.middleware';
import { ROLES } from '../utils/constant';
import { IReqUser } from '../utils/interfaces';
import DonationController from '../modules/controllers/donation.controller';

export class DonationRouter {
	private router: Router;
	private donationController: DonationController;

	constructor(donationController: DonationController) {
		this.router = express.Router();
		this.donationController = donationController;
		this.initializeRoutes();
	}

	private initializeRoutes(): void {
		this.router.post(
			'/donation/:campaigSlug',
			(req: IReqUser, res: Response, _next: NextFunction) =>
				this.donationController.create(req, res)
		);
		this.router.put(
			'/donation/:donationId/complete',
			(req: IReqUser, res: Response, _next: NextFunction) =>
				this.donationController.complete(req, res)
		);
		this.router.get(
			'/donation',
			(req: IReqUser, res: Response, _next: NextFunction) =>
				this.donationController.findAllDonationByCampaign(req, res)
		);
	}

	public getRouter(): Router {
		return this.router;
	}
}

export default (donationController: DonationController): Router => {
	return new DonationRouter(donationController).getRouter();
};
