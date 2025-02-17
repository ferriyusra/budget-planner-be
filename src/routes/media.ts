import express, { Response, NextFunction, Router } from 'express';
import aclMiddleware from '../middlewares/acl.middleware';
import authMiddleware from '../middlewares/auth.middleware';
import { ROLES } from '../utils/constant';
import { IReqUser } from '../utils/interfaces';
import mediaMiddleware from '../middlewares/media.middleware';
import { MediaController } from '../modules/controllers/media.controller';

export class MediaRouter {
	private router: Router;
	private mediaController: MediaController;

	constructor(mediaController: MediaController) {
		this.router = express.Router();
		this.mediaController = mediaController;
		this.initializeRoutes();
	}

	private initializeRoutes(): void {
		this.router.post(
			'/media/upload-single',
			[
				authMiddleware,
				aclMiddleware([ROLES.ADMIN, ROLES.DONORS, ROLES.CAMPAIGN_CREATORS]),
			],
			mediaMiddleware.single('file'),
			(req: IReqUser, res: Response, _next: NextFunction) =>
				this.mediaController.single(req, res)
		);

		this.router.post(
			'/media/upload-multiple',
			[
				authMiddleware,
				aclMiddleware([ROLES.ADMIN, ROLES.DONORS, ROLES.CAMPAIGN_CREATORS]),
			],
			mediaMiddleware.single('files'),
			(req: IReqUser, res: Response, _next: NextFunction) =>
				this.mediaController.multiple(req, res)
		);

		this.router.delete(
			'/media/remove',
			[
				authMiddleware,
				aclMiddleware([ROLES.ADMIN, ROLES.DONORS, ROLES.CAMPAIGN_CREATORS]),
			],
			(req: IReqUser, res: Response, _next: NextFunction) =>
				this.mediaController.remove(req, res)
		);
	}

	public getRouter(): Router {
		return this.router;
	}
}

export default (mediaController: MediaController): Router => {
	return new MediaRouter(mediaController).getRouter();
};
