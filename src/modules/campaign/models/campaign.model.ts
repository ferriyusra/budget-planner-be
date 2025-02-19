import mongoose, { ObjectId } from 'mongoose';
import * as Yup from 'yup';

const Schema = mongoose.Schema;

export const campaignDTO = Yup.object({
	name: Yup.string().required(),
	description: Yup.string().required(),
	slug: Yup.string(),
	image: Yup.string().required(),
	targetAmount: Yup.number().required(),
	collectedAmount: Yup.number(),
	deadline: Yup.string().required(),
	category: Yup.string().required(),
	createdBy: Yup.string().required(),
	createdAt: Yup.string(),
	updatedAt: Yup.string(),
});

export type TypeCampaign = Yup.InferType<typeof campaignDTO>;

export enum CampaignStatus {
	PENDING = 'pending',
	REVIEW = 'review',
	APPROVED = 'approved',
	REJECTED = 'rejected',
}

export interface Campaign
	extends Omit<TypeCampaign, 'category' | 'createdBy' | 'status'> {
	category: ObjectId;
	createdBy: ObjectId;
	status: string;
}

const CampaignSchema = new Schema<Campaign>(
	{
		name: {
			type: Schema.Types.String,
			required: true,
		},
		description: {
			type: Schema.Types.String,
			required: true,
		},
		slug: {
			type: Schema.Types.String,
			unique: true,
		},
		image: {
			type: Schema.Types.String,
			required: true,
		},
		targetAmount: {
			type: Schema.Types.Number,
			required: true,
		},
		collectedAmount: {
			type: Schema.Types.Number,
			default: 0,
		},
		deadline: {
			type: Schema.Types.String,
			required: true,
		},
		category: {
			type: Schema.Types.ObjectId,
			ref: 'Category',
			required: true,
		},
		status: {
			type: Schema.Types.String,
			enum: [
				CampaignStatus.PENDING,
				CampaignStatus.REVIEW,
				CampaignStatus.APPROVED,
				CampaignStatus.REJECTED,
			],
			default: CampaignStatus.PENDING,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
).index({ name: 'text' });

CampaignSchema.pre('save', function () {
	if (!this.slug) {
		const slug = this.name.split(' ').join('-').toLowerCase();
		this.slug = `${slug}`;
	}
});

const CampaignModel = mongoose.model('Campaign', CampaignSchema);

export default CampaignModel;
