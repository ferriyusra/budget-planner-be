import response from '../../utils/response';
import { Response } from 'express';
import { IPaginationQuery, IReqUser } from '../../utils/interfaces';
import { SimulationType } from '../simulation/models/simulation.model';
import SimulationService from '../simulation/service';
import { simulationKprDTO } from '../simulation/validation/simulationKprDTO';

class SimulationController {
	constructor(private readonly simulationService: SimulationService) {}

	async create(req: IReqUser, res: Response) {
		try {
			const { simulationType } = req.body;
			if (!req.user?.id) {
				return response.unauthorized(res, 'User not authenticated');
			}

			switch (simulationType) {
				case SimulationType.KPR:
					await simulationKprDTO.validate(req.body);
					break;
				default:
					throw new Error('Unsupported simulation type');
			}

			const result = await this.simulationService.create({
				data: req.body,
				userId: req.user.id.toString(),
			});
			return response.success(res, result, 'Success create simulation');
		} catch (error) {
			return response.error(res, error, 'Failed create simulation');
		}
	}

	async findAll(req: IReqUser, res: Response) {
		try {
			const page = Number(req.query.page) || 1;
			const limit = Number(req.query.limit) || 10;
			const search = String(req.query.search || '');

			if (!req.user?.id) {
				return response.unauthorized(res, 'User not authenticated');
			}

			const query = { userId: req.user.id };

			const [data, total] = await Promise.all([
				this.simulationService.findAll(query, limit, page, search),
				this.simulationService.count(query),
			]);

			return response.success(
				res,
				{
					data,
					pagination: {
						total,
						page,
						limit,
						totalPages: Math.ceil(total / limit),
					},
				},
				'Success get simulations'
			);
		} catch (error) {
			return response.error(res, error, 'Failed get simulations');
		}
	}
}

export default SimulationController;
