import DonationRepository from './repository';

class DonationService {
	constructor(private readonly donationRepository: DonationRepository) {}

	async create(data: any) {
		return this.donationRepository.create(data);
	}

	async findAllDonationByCampaign(query: object, limit: number, page: number) {
		return this.donationRepository.findAllDonationByCampaign(
			query,
			limit,
			page
		);
	}

	async countDonationByCampaign(query: object) {
		return this.donationRepository.countDonationByCampaign(query);
	}

	async findOneDonation(donationId: string) {
		return this.donationRepository.findOneDonation(donationId);
	}

	async updateDonation(donationId: string, status: string) {
		return this.donationRepository.updateDonation(donationId, status);
	}

	// async findOneDonation(query: object) {
	// 	return this.donationRepository.findOneDonation(query);
	// }

	// async updateDonation(data: any) {
	// 	return this.donationRepository.updateDonation(data);
	// }
}

export default DonationService;
