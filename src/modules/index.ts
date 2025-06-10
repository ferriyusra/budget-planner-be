import { Connection } from 'mongoose';
import AuthRepository from './auth/repository';
import AuthService from './auth/service';
import AuthController from './controllers/auth.controller';
import SimulationKprRepository from './simulation_kpr/repository';
import SimulationKprService from './simulation_kpr/service';
import SimulationKprController from './controllers/simulation_kpr.controller';

function createAuthRepository(db: Connection): AuthRepository {
	return new AuthRepository(db);
}

function createAuthService(repository: AuthRepository): AuthService {
	return new AuthService(repository);
}

function createAuthController(authService: AuthService): AuthController {
	return new AuthController(authService);
}

function createSimulationKprRepository(
	db: Connection
): SimulationKprRepository {
	return new SimulationKprRepository(db);
}

function createSimulationKprService(
	repository: SimulationKprRepository
): SimulationKprService {
	return new SimulationKprService(repository);
}

function createSimulationKprController(
	categoryService: SimulationKprService
): SimulationKprController {
	return new SimulationKprController(categoryService);
}

export {
	// Repository
	createAuthRepository,
	createSimulationKprRepository,

	// Service
	createAuthService,
	createSimulationKprService,

	// Controller
	createAuthController,
	createSimulationKprController,
};
