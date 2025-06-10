import { Connection, Model } from 'mongoose';
import SimulationModel, { Simulation } from './models/simulation.model';

class SimulationKprRepository {
	private readonly simulationModel: Model<Simulation>;

	constructor(db: Connection) {
		this.simulationModel = db.model<Simulation>(
			'Simulation',
			SimulationModel.schema
		);
	}

	async create(data: any, userId: string) {
		return this.simulationModel.create({ title: data.title, ...data, userId });
	}

	async findById(id: string, userId: string) {
		return this.simulationModel.findOne({
			_id: id,
			userId,
		});
	}

	async findAll(query: object, limit: number, page: number, search: string) {
		const searchQuery = search
			? {
					$or: [
						{ title: { $regex: search, $options: 'i' } },
						{ simulationType: { $regex: search, $options: 'i' } },
					],
			  }
			: {};

		const data = await this.simulationModel
			.find({ ...query, ...searchQuery })
			.limit(limit)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.exec();

		return data;
	}

	async count(query: object) {
		return this.simulationModel.countDocuments(query);
	}

	async update(id: string, data: any) {
		const updated = await this.simulationModel.findByIdAndUpdate(id, data, {
			new: true,
		});
		return updated;
	}

	async remove(id: string) {
		const affectedRow = await this.simulationModel.findByIdAndDelete(id, {
			new: true,
		});
		return affectedRow;
	}
}

export default SimulationKprRepository;
