import AuthRepository from './repository';

class AuthService {
	constructor(private readonly authRepository: AuthRepository) {}

	async register(data: any): Promise<any> {
		const { fullName, username, email, password } = data;
		return this.authRepository.create({
			fullName,
			email,
			username,
			password,
		});
	}

	async userByIdentifier(identifier: string): Promise<any> {
		return this.authRepository.userByIdentifier(identifier);
	}

	async findById(id: string | null) {
		return this.authRepository.findById(id);
	}

	async activation(code: string | null) {
		return this.authRepository.activate(code);
	}
}

export default AuthService;
