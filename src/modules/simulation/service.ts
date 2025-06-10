import { IReqUser } from '../../utils/interfaces';
import { calculateAmortizationSchedule } from '../../utils/kpr.helper';
import { SimulationType } from './models/simulation.model';
import SimulationRepository from './repository';

class SimulationService {
	constructor(private readonly simulationRepository: SimulationRepository) {}

	async create({ data, userId }: { data: any; userId: string }) {
		const { simulationType } = data;

		if (simulationType === SimulationType.KPR) {
			const result = calculateAmortizationSchedule(data);
			data.data = result;
		}

		return this.simulationRepository.create(data, userId);
	}

	async findAll(query: object, limit: number, page: number, search: string) {
		const data = await this.simulationRepository.findAll(
			query,
			limit,
			page,
			search
		);
		return data;
	}

	async count(query: object) {
		const count = await this.simulationRepository.count(query);
		return count;
	}

	async findById(id: string) {
		const data = await this.simulationRepository.findById(id);
		return data;
	}
}

export default SimulationService;
