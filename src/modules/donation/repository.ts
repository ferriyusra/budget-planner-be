import { Model, Connection } from 'mongoose';
import DonationModel, { Donation } from './models/donation.model';

class DonationRepository {
	private readonly donationModel: Model<Donation>;

	constructor(private readonly db: Connection) {
		this.donationModel = db.model<Donation>('Donation', DonationModel.schema);
	}

	async create(data: any) {
		return this.donationModel.create(data);
	}

	async findAllDonationByCampaign(query: object, limit: number, page: number) {
		return this.donationModel
			.find(query)
			.limit(limit)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.lean()
			.exec();
	}

	async countDonationByCampaign(query: object) {
		return this.donationModel.countDocuments(query);
	}

	async findOneDonation(donationId: string) {
		return this.donationModel.findOne({ donationId });
	}

	async updateDonation(donationId: string, status: string) {
		return this.donationModel.findOneAndUpdate(
			{
				donationId,
			},
			{
				status,
			},
			{
				new: true,
			}
		);
	}
}

export default DonationRepository;
