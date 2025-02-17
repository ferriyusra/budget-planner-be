import { NextFunction, Request, Response } from 'express';
import response from '../utils/response';

export default {
	serverRoute() {
		return (req: Request, res: Response, next: NextFunction) => {
			response.notfound(res, 'route not found');
		};
	},

	serverError() {
		return (err: Error, req: Request, res: Response, next: NextFunction) => {
			response.error(res, err, err.message);
		};
	},
};
