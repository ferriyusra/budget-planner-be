import { Request, Response } from 'express';
import AuthService from '../auth/service';
import response from '../../utils/response';
import UserModel, { userDTO, userLoginDTO } from '../auth/models/user.model';
import { encrypt } from '../../utils/encryption';
import { generateToken } from '../../utils/jwt';
import { IReqUser } from '../../utils/interfaces';

class AuthController {
	constructor(private readonly authService: AuthService) {}

	async register(req: Request, res: Response) {
		try {
			const { fullName, username, email, password, confirmPassword } = req.body;
			await userDTO.validate({
				fullName,
				username,
				email,
				password,
				confirmPassword,
			});

			const result = await this.authService.register({
				fullName,
				email,
				username,
				password,
			});

			return response.success(res, result, 'User registered successfully');
		} catch (error) {
			return response.error(res, error, 'User registration failed');
		}
	}

	async login(req: Request, res: Response) {
		try {
			const { identifier, password } = req.body;
			await userLoginDTO.validate({
				identifier,
				password,
			});

			const userByIdentifier = await UserModel.findOne({
				$or: [
					{
						email: identifier,
					},
					{
						username: identifier,
					},
				],
				isActive: true,
			});

			if (!userByIdentifier) {
				return response.unauthorized(res, 'User not found');
			}

			const validatePassword: boolean =
				encrypt(password) === userByIdentifier.password;

			if (!validatePassword) {
				return response.unauthorized(res, 'User not found');
			}

			const token = generateToken({
				id: userByIdentifier._id,
				role: userByIdentifier.role,
			});
			return response.success(res, token, 'Login success');
		} catch (error) {
			return response.error(res, error, 'Login failed');
		}
	}

	async me(req: IReqUser, res: Response) {
		try {
			const user = req.user;
			const result = await this.authService.findById(`${user?.id}`);
			return response.success(res, result, 'Success get user profile');
		} catch (error) {
			return response.error(res, error, 'Failed get user profile');
		}
	}

	async activation(req: Request, res: Response) {
		try {
			const { code } = req.body as { code: string };

			const user = await this.authService.activation(code);
			return response.success(res, user, 'User Successfully Activate');
		} catch (error) {
			const err = error as unknown as Error;
		}
	}
}

export default AuthController;
