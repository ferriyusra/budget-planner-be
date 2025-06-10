/**
 * Input parameters for KPR (Kredit Pemilikan Rumah) calculation
 */
type KprInput = {
	/** Total harga properti */
	initialInvestment: number;
	/** Uang muka yang dibayarkan */
	downPayment: number;
	/** Total jangka waktu KPR dalam bulan */
	loanTenureMonths: number;
	/** Suku bunga tetap dalam persen */
	fixedInterestRate: number;
	/** Periode suku bunga tetap dalam bulan */
	fixedPeriodMonths: number;
	/** Suku bunga mengambang dalam persen */
	floatingInterestRate: number;
	/** Periode suku bunga mengambang dalam bulan */
	floatingPeriodMonths: number;
};

/**
 * Representasi satu baris dalam jadwal amortisasi KPR
 */
type AmortizationEntry = {
	/** Bulan ke berapa dalam jadwal */
	month: number;
	/** Total angsuran per bulan */
	installment: number;
	/** Komponen bunga dalam angsuran */
	interest: number;
	/** Komponen pokok dalam angsuran */
	principal: number;
	/** Sisa pokok pinjaman */
	remainingPrincipal: number;
	/** Tipe periode: fixed atau floating */
	type: 'fixed' | 'floating';
};

/**
 * Menghitung jadwal amortisasi KPR dengan sistem angsuran tetap
 * yang terdiri dari periode suku bunga tetap dan mengambang
 *
 * @param input Parameter input untuk perhitungan KPR
 * @returns Array jadwal amortisasi per bulan
 * @throws Error jika total periode tidak sesuai dengan tenure KPR
 *
 * @example
 * const schedule = calculateAmortizationSchedule({
 *   initialInvestment: 500000000,
 *   downPayment: 100000000,
 *   loanTenureMonths: 120,
 *   fixedInterestRate: 5,
 *   fixedPeriodMonths: 60,
 *   floatingInterestRate: 7,
 *   floatingPeriodMonths: 60
 * });
 */
export function calculateAmortizationSchedule(
	input: KprInput
): AmortizationEntry[] {
	const {
		initialInvestment,
		downPayment,
		loanTenureMonths,
		fixedInterestRate,
		fixedPeriodMonths,
		floatingInterestRate,
		floatingPeriodMonths,
	} = input;

	if (loanTenureMonths !== fixedPeriodMonths + floatingPeriodMonths) {
		throw new Error(
			`Total periode angsuran tidak sesuai: ${loanTenureMonths} bulan vs ${
				fixedPeriodMonths + floatingPeriodMonths
			} bulan.`
		);
	}

	const loanAmount = initialInvestment - downPayment;
	const schedule: AmortizationEntry[] = [];

	let remainingPrincipal = loanAmount;

	const fixedMonthlyRate = fixedInterestRate / 100 / 12;
	const floatingMonthlyRate = floatingInterestRate / 100 / 12;

	const fixedInstallment =
		(loanAmount *
			(fixedMonthlyRate * Math.pow(1 + fixedMonthlyRate, fixedPeriodMonths))) /
		(Math.pow(1 + fixedMonthlyRate, fixedPeriodMonths) - 1);

	const floatingInstallment = (remainingPrincipalAfterFixed: number) =>
		(remainingPrincipalAfterFixed *
			(floatingMonthlyRate *
				Math.pow(1 + floatingMonthlyRate, floatingPeriodMonths))) /
		(Math.pow(1 + floatingMonthlyRate, floatingPeriodMonths) - 1);

	// Fixed Period Calculation
	for (let i = 1; i <= fixedPeriodMonths; i++) {
		const interest = remainingPrincipal * fixedMonthlyRate;
		const principal = fixedInstallment - interest;
		remainingPrincipal -= principal;

		// installment -> Jumlah Angsuran
		// interest -> Angsuran Bunga
		// principal -> Angsuran Pokok
		// remainingPrincipal -> Saldo Pokok
		schedule.push({
			month: i,
			installment: Math.round(fixedInstallment),
			interest: Math.round(interest),
			principal: Math.round(principal),
			remainingPrincipal: Math.round(remainingPrincipal),
			type: 'fixed',
		});
	}

	// Floating Period Calculation
	const floatingInst = floatingInstallment(remainingPrincipal);
	for (let i = 1; i <= floatingPeriodMonths; i++) {
		const interest = remainingPrincipal * floatingMonthlyRate;
		const principal = floatingInst - interest;
		remainingPrincipal -= principal;

		// Pastikan remainingPrincipal = 0 di bulan terakhir
		if (i === floatingPeriodMonths || remainingPrincipal < 1) {
			remainingPrincipal = 0;
		}

		// installment -> Jumlah Angsuran
		// interest -> Angsuran Bunga
		// principal -> Angsuran Pokok
		// remainingPrincipal -> Saldo Pokok
		schedule.push({
			month: fixedPeriodMonths + i,
			installment: Math.round(floatingInst),
			interest: Math.round(interest),
			principal: Math.round(principal),
			remainingPrincipal: Math.round(remainingPrincipal),
			type: 'floating',
		});
	}

	return schedule;
}
