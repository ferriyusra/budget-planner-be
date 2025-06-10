import mongoose, { ObjectId } from 'mongoose';
import { USER_MODEL_NAME } from '../../auth/models/user.model';

const Schema = mongoose.Schema;

export enum SimulationType {
	KPR = 'KPR',
	INVESTASI = 'INVESTASI',
	NIKAH = 'NIKAH',
}

export interface Simulation {
	userId: ObjectId;
	simulationType: SimulationType;
	title: string;
	data: Record<string, any>;
}

const SimulationSchema = new Schema<Simulation>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: USER_MODEL_NAME,
			required: true,
		},
		simulationType: {
			type: String,
			enum: Object.values(SimulationType),
			required: true,
		},
		title: { type: String, required: true },
		data: { type: Object, required: true },
	},
	{
		timestamps: true,
	}
);

const SimulationModel = mongoose.model('Simulation', SimulationSchema);

export default SimulationModel;
