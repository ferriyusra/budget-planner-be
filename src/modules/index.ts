import { Connection } from 'mongoose';
import AuthRepository from './auth/repository';
import AuthService from './auth/service';
import AuthController from './controllers/auth.controller';
import CategoryRepository from './category/repository';
import CategoryService from './category/service';
import CategoryController from './controllers/category.controller';
import { MediaController } from './controllers/media.controller';
import { MediaService } from './media/media.service';
import { CloudinaryUploader } from '../utils/uploader';
import CampaignRepository from './campaign/repository';
import CampaignService from './campaign/service';
import CampaignController from './controllers/campaign.controller';
import DonationRepository from './donation/repository';
import DonationService from './donation/service';
import DonationController from './controllers/donation.controller';

function createAuthRepository(db: Connection): AuthRepository {
	return new AuthRepository(db);
}

function createAuthService(repository: AuthRepository): AuthService {
	return new AuthService(repository);
}

function createAuthController(authService: AuthService): AuthController {
	return new AuthController(authService);
}

function createCategoryRepository(db: Connection): CategoryRepository {
	return new CategoryRepository(db);
}

function createCategoryService(
	repository: CategoryRepository
): CategoryService {
	return new CategoryService(repository);
}

function createCategoryController(
	categoryService: CategoryService
): CategoryController {
	return new CategoryController(categoryService);
}

function createMediaService(cloudinary: CloudinaryUploader): MediaService {
	return new MediaService(cloudinary);
}

function createMediaController(mediaService: MediaService): MediaController {
	return new MediaController(mediaService);
}

function createCampaignRepository(db: Connection): CampaignRepository {
	return new CampaignRepository(db);
}

function createCampaignService(
	repository: CampaignRepository
): CampaignService {
	return new CampaignService(repository);
}

function createCampaignController(
	campaignService: CampaignService,
	mediaService: MediaService
): CampaignController {
	return new CampaignController(campaignService, mediaService);
}

function createDonationRepository(db: Connection): DonationRepository {
	return new DonationRepository(db);
}

function createDonationService(
	repository: DonationRepository
): DonationService {
	return new DonationService(repository);
}

function createDonationController(
	donationService: DonationService,
	campaignService: CampaignService
): DonationController {
	return new DonationController(donationService, campaignService);
}

export {
	createAuthRepository,
	createAuthService,
	createAuthController,
	createCategoryRepository,
	createCategoryService,
	createCategoryController,
	createCampaignRepository,
	createCampaignService,
	createCampaignController,
	createMediaService,
	createMediaController,
	createDonationRepository,
	createDonationService,
	createDonationController,
};
