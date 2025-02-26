import { Connection, Model } from 'mongoose';
import CampaignModel, {
	Campaign,
	CampaignStatus,
} from './models/campaign.model';
import { ICampaign } from './interface';

class CampaignRepository {
	private readonly campaignModel: Model<Campaign>;

	constructor(private readonly db: Connection) {
		this.campaignModel = db.model<Campaign>('Campaign', CampaignModel.schema);
	}

	async create(data: ICampaign) {
		return this.campaignModel.create(data);
	}

	async findById(id: string) {
		return this.campaignModel.findById(id);
	}

	async findByIdAndStatusApproved(id: string) {
		return this.campaignModel.findOne({
			_id: id,
			status: CampaignStatus.APPROVED,
		});
	}

	async findAll(query: object, limit: number, page: number) {
		const data = await this.campaignModel
			.find(query)
			.limit(+limit)
			.skip((+page - 1) * +limit)
			.sort({ createdAt: -1 })
			.lean()
			.exec();

		return data;
	}

	async count(query: object) {
		return this.campaignModel.countDocuments(query);
	}

	async update(id: string, data: ICampaign) {
		const updated = await this.campaignModel.findByIdAndUpdate(
			id,
			{
				...data,
				updatedAt: new Date(),
			},
			{
				new: true,
			}
		);
		return updated;
	}

	async remove(id: string) {
		const affectedRow = await this.campaignModel.findByIdAndDelete(id, {
			new: true,
		});
		return affectedRow;
	}

	async findBySlug(slug: string) {
		return this.campaignModel.findOne({
			slug,
			status: CampaignStatus.APPROVED,
		});
	}
}

export default CampaignRepository;
