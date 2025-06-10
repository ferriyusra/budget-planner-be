import { IReqUser } from '../../utils/interfaces';
import { calculateAmortizationSchedule } from '../../utils/kpr.helper';
import { SimulationType } from './models/simulation.model';
import SimulationRepository from './repository';
import * as XLSX from 'xlsx';

interface ISimulation {
	_id: string;
	userId: string;
	simulationType: SimulationType;
	title: string;
	data: Array<{
		month: number;
		installment: number;
		interest: number;
		principal: number;
		remainingPrincipal: number;
		type: string;
	}>;
}

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

	async findById(id: string, userId: string) {
		const data = await this.simulationRepository.findById(id, userId);
		return data;
	}

	async generateExcel(simulationId: string, userId: string) {
		// First fetch the simulation data from database
		const simulation = (await this.findById(
			simulationId,
			userId
		)) as unknown as ISimulation;

		if (!simulation) {
			throw new Error('Simulation not found');
		}

		const workbook = XLSX.utils.book_new();

		// Add simulation details
		const detailsData = [
			['Simulation Details'],
			['Title', simulation.title],
			['Type', simulation.simulationType],
			['Created At', new Date().toLocaleString()],
			[],
		];

		if (simulation.simulationType === SimulationType.KPR) {
			// Add amortization schedule
			if (simulation.data && Array.isArray(simulation.data)) {
				const scheduleData = [
					['Amortization Schedule'],
					[
						'Month',
						'Installment',
						'Principal',
						'Interest',
						'Remaining Principal',
						'Type',
					],
				];

				simulation.data.forEach((item) => {
					scheduleData.push([
						item.month.toString(),
						item.installment.toString(),
						item.principal.toString(),
						item.interest.toString(),
						item.remainingPrincipal.toString(),
						item.type,
					]);
				});

				const scheduleSheet = XLSX.utils.aoa_to_sheet(scheduleData);
				XLSX.utils.book_append_sheet(
					workbook,
					scheduleSheet,
					'Amortization Schedule'
				);
			}
		}

		const detailsSheet = XLSX.utils.aoa_to_sheet(detailsData);
		XLSX.utils.book_append_sheet(workbook, detailsSheet, 'Simulation Details');

		// Generate buffer
		return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
	}
}

export default SimulationService;
