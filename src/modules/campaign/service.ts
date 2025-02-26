import { IReqUser } from '../../utils/interfaces';
import { ICampaign } from './interface';
import CampaignRepository from './repository';

class CampaignService {
	constructor(private readonly campaignRepository: CampaignRepository) {}

	async create(data: ICampaign) {
		return this.campaignRepository.create(data);
	}

	async update(id: string, data: ICampaign) {
		return this.campaignRepository.update(id, data);
	}

	async remove(id: string) {
		return this.campaignRepository.remove(id);
	}

	async findById(id: string) {
		return this.campaignRepository.findById(id);
	}

	async findByIdAndStatusApproved(id: string) {
		return this.campaignRepository.findByIdAndStatusApproved(id);
	}

	async findAll(query: object, limit: number, page: number) {
		const data = await this.campaignRepository.findAll(query, limit, page);
		return data;
	}

	async findAllByCampaign(query: object, limit: number, page: number) {
		const data = await this.campaignRepository.findAll(query, limit, page);
		return data;
	}

	async count(query: object) {
		const count = await this.campaignRepository.count(query);
		return count;
	}

	async findBySlug(slug: string) {
		return this.campaignRepository.findBySlug(slug);
	}
}

export default CampaignService;
