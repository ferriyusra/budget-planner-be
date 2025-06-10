import * as Yup from 'yup';

export const simulationKprDTO = Yup.object({
	title: Yup.string().required('Title is required'),
	downPayment: Yup.number().required('Down payment is required'),
	monthlyIncome: Yup.number().required('Monthly income is required'),
	loanTenureMonths: Yup.number()
		.required('Loan tenure is required')
		.min(12, 'Minimum loan tenure is 12 months'),
	fixedInterestRate: Yup.number()
		.required('Fixed interest rate is required')
		.min(0, 'Fixed interest rate cannot be negative'),
	fixedPeriodMonths: Yup.number()
		.required('Fixed period is required')
		.min(1, 'Minimum fixed period is 1 month'),
	floatingInterestRate: Yup.number()
		.required('Floating interest rate is required')
		.min(0, 'Floating interest rate cannot be negative'),
	floatingPeriodMonths: Yup.number()
		.required('Floating period is required')
		.min(1, 'Minimum floating period is 1 month'),
});
