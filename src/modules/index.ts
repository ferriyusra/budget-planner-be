import { Connection } from 'mongoose';
import AuthRepository from './auth/repository';
import AuthService from './auth/service';
import AuthController from './controllers/auth.controller';
import SimulationRepository from './simulation/repository';
import SimulationService from './simulation/service';
import SimulationController from './controllers/simulation.controller';

function createAuthRepository(db: Connection): AuthRepository {
	return new AuthRepository(db);
}

function createAuthService(repository: AuthRepository): AuthService {
	return new AuthService(repository);
}

function createAuthController(authService: AuthService): AuthController {
	return new AuthController(authService);
}

function createSimulationRepository(db: Connection): SimulationRepository {
	return new SimulationRepository(db);
}

function createSimulationService(
	repository: SimulationRepository
): SimulationService {
	return new SimulationService(repository);
}

function createSimulationController(
	categoryService: SimulationService
): SimulationController {
	return new SimulationController(categoryService);
}

export {
	// Repository
	createAuthRepository,
	createSimulationRepository,

	// Service
	createAuthService,
	createSimulationService,

	// Controller
	createAuthController,
	createSimulationController,
};
