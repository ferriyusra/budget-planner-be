import response from '../../utils/response';
import { Response } from 'express';
import { IPaginationQuery, IReqUser } from '../../utils/interfaces';
import { FilterQuery, isValidObjectId } from 'mongoose';
import CampaignService from '../campaign/service';
import { campaignDTO, TypeCampaign } from '../campaign/models/campaign.model';
import { MediaService } from '../media/media.service';

class CampaignController {
	constructor(
		private readonly campaignService: CampaignService,
		private readonly mediaService: MediaService
	) {}

	async create(req: IReqUser, res: Response) {
		try {
			const payload = { ...req.body, createdBy: req.user?.id } as TypeCampaign;

			await campaignDTO.validate(payload);
			const result = await this.campaignService.create(payload);
			return response.success(res, result, 'Success create campaign');
		} catch (error) {
			return response.error(res, error, 'Failed create campaign');
		}
	}

	async findAll(req: IReqUser, res: Response) {
		try {
			const buildQuery = (filter: any) => {
				let query: FilterQuery<TypeCampaign> = {};

				if (filter.search) {
					query.$text = {
						$search: filter.search,
					};
				}

				if (filter.category) {
					query.category = filter.category;
				}

				return query;
			};

			const { limit = 10, page = 1, search, category } = req.query;

			const query = buildQuery({
				search,
				category,
			});

			const result = await this.campaignService.findAll(query, +limit, +page);

			const count = await this.campaignService.count(query);

			return response.pagination(
				res,
				result,
				{
					total: count,
					totalPages: Math.ceil(+count / +limit),
					current: +page,
				},
				'Success find all campaign'
			);
		} catch (error) {
			return response.error(res, error, 'Failed find all campaign');
		}
	}

	async findOne(req: IReqUser, res: Response) {
		try {
			const { id } = req.params;
			if (!isValidObjectId(id)) {
				return response.notfound(res, 'campaign not found');
			}

			const result = await this.campaignService.findById(id);

			if (!result) {
				return response.notfound(res, 'campaign not found');
			}

			return response.success(res, result, 'Success find one campaign');
		} catch (error) {
			return response.error(res, error, 'Failed find one campaign');
		}
	}

	async update(req: IReqUser, res: Response) {
		try {
			const { id } = req.params;
			if (!isValidObjectId(id)) {
				return response.notfound(res, 'campaign not found');
			}

			const result = await this.campaignService.update(id, req.body);
			if (!result) {
				return response.notfound(res, 'campaign not found');
			}

			return response.success(res, result, 'Success update campaign');
		} catch (error) {
			return response.error(res, error, 'Failed update campaign');
		}
	}

	async remove(req: IReqUser, res: Response) {
		try {
			const { id } = req.params;
			if (!isValidObjectId(id)) {
				return response.notfound(res, 'campaign not found');
			}

			const result = await this.campaignService.remove(id);
			if (!result) {
				return response.notfound(res, 'campaign not found');
			}

			await this.mediaService.remove(result.image);

			return response.success(res, result, 'Success remove campaign');
		} catch (error) {
			return response.error(res, error, 'Failed remove campaign');
		}
	}
}

export default CampaignController;
