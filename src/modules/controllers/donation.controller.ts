import { IReqUser } from '../../utils/interfaces';
import { Response } from 'express';
import response from '../../utils/response';
import CampaignService from '../campaign/service';
import CampaignModel, {
	CampaignStatus,
	TypeCampaign,
} from '../campaign/models/campaign.model';
import { FilterQuery, isValidObjectId } from 'mongoose';
import DonationModel, {
	donationDTO,
	DonationStatus,
	TypeDonation,
} from '../donation/models/donation.model';
import DonationService from '../donation/service';

class DonationController {
	constructor(
		private readonly donationService: DonationService,
		private readonly campaignService: CampaignService
	) {}

	async create(req: IReqUser, res: Response) {
		try {
			const { campaignSlug } = req.params;
			const payload = {
				...req.body,
			} as TypeDonation;

			await donationDTO.validate(payload);

			const campaign = await this.campaignService.findBySlug(campaignSlug);
			if (!campaign) {
				return response.notfound(res, 'campaign not found');
			}

			const result = await this.donationService.create(payload);
			response.success(res, result, 'success to create an donation');
		} catch (error) {
			response.error(res, error, 'failed to create an donation');
		}
	}

	async findAllDonationByCampaign(req: IReqUser, res: Response) {
		try {
			const { campaignId } = req.params;

			const buildQuery = (filter: any) => {
				let query: FilterQuery<TypeCampaign> = {
					campaigns: campaignId,
				};

				if (filter.amount) {
					query.amount = filter.amount;
				}
				return query;
			};

			const { limit = 10, page = 1, search } = req.query;

			const query = buildQuery({
				search,
			});

			const result = await this.donationService.findAllDonationByCampaign(
				query,
				+limit,
				+page
			);

			const count = await this.donationService.countDonationByCampaign(query);

			response.pagination(
				res,
				result,
				{
					current: +page,
					total: count,
					totalPages: Math.ceil(count / +limit),
				},
				'success find all donations'
			);
		} catch (error) {
			response.error(res, error, 'failed to find all donations');
		}
	}

	async complete(req: IReqUser, res: Response) {
		try {
			const { donationId } = req.params;
			const donation = await this.donationService.findOneDonation(
				`${donationId}`
			);

			if (!donation) {
				return response.notfound(res, 'donation not found');
			}

			if (donation.status === DonationStatus.COMPLETED) {
				return response.error(
					res,
					null,
					'you have been completed this donation'
				);
			}

			const result = await this.donationService.updateDonation(
				donationId,
				DonationStatus.COMPLETED
			);

			const campaign = await this.campaignService.findById(
				`${donation.campaigns}`
			);
			if (!campaign) {
				return response.notfound(res, 'campaign and donation not found');
			}

			const newCollectedAmount =
				Number(campaign.collectedAmount) + Number(donation.amount);

			const progressValue =
				(newCollectedAmount / Number(campaign.targetAmount)) * 100;

			await CampaignModel.updateOne(
				{ _id: campaign._id },
				{
					collectedAmount: newCollectedAmount,
					progressValue: progressValue,
				}
			);

			response.success(res, result, 'success to complete an donation');
		} catch (error) {
			response.error(res, error, 'failed to complete an donation');
		}
	}
}

export default DonationController;
