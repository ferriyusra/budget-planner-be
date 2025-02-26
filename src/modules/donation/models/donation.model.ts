import { create } from 'lodash';
import mongoose, { ObjectId, Schema } from 'mongoose';
import * as Yup from 'yup';
import payment, { TypeResponseMidtrans } from '../../../utils/payment';
import { USER_MODEL_NAME } from '../../auth/models/user.model';
import { CAMPAIGN_MODEL_NAME } from '../../campaign/models/campaign.model';
import { getId } from '../../../utils/id';

export const DONATION_MODEL_NAME = 'Donation';

export enum DonationStatus {
	PENDING = 'pending',
	COMPLETED = 'completed',
	CANCELLED = 'cancelled',
}

export const donationDTO = Yup.object({
	name: Yup.string(),
	createdBy: Yup.string(),
	campaigns: Yup.string().required(),
	amount: Yup.number().required().min(10000, 'Minimum donation is Rp 10.000'),
	message: Yup.string(),
	isShowName: Yup.boolean(),
});

export type TypeDonation = Yup.InferType<typeof donationDTO>;

export interface Donation
	extends Omit<TypeDonation, 'createdBy' | 'campaigns'> {
	status: string;
	campaigns: ObjectId;
	payment: TypeResponseMidtrans;
	// createdBy: ObjectId;
	donationId: string;
}

const DonationSchema = new Schema<Donation>(
	{
		donationId: {
			type: Schema.Types.String,
		},
		name: {
			type: Schema.Types.String,
		},
		message: {
			type: Schema.Types.String,
		},
		// createdBy: {
		// 	type: Schema.Types.ObjectId,
		// 	ref: USER_MODEL_NAME,
		// },
		campaigns: {
			type: Schema.Types.ObjectId,
			ref: CAMPAIGN_MODEL_NAME,
			required: true,
		},
		amount: {
			type: Schema.Types.Number,
			required: true,
		},
		payment: {
			type: {
				token: {
					type: Schema.Types.String,
					required: true,
				},
				redirect_url: {
					type: Schema.Types.String,
					required: true,
				},
			},
		},
		status: {
			type: Schema.Types.String,
			enum: [
				DonationStatus.PENDING,
				DonationStatus.COMPLETED,
				DonationStatus.CANCELLED,
			],
			default: DonationStatus.PENDING,
		},
		isShowName: {
			type: Schema.Types.Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
).index({ donationId: 'text' });

DonationSchema.pre('save', async function () {
	const donation = this;
	donation.donationId = getId();
	donation.payment = await payment.createLink({
		transaction_details: {
			gross_amount: donation.amount,
			order_id: donation.donationId,
		},
	});
});

const DonationModel = mongoose.model(DONATION_MODEL_NAME, DonationSchema);

export default DonationModel;
