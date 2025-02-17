import { v2 as cloudinary } from 'cloudinary';
import {
	CLOUDINARY_CLOUD_NAME,
	CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET,
} from './env';

cloudinary.config({
	cloud_name: CLOUDINARY_CLOUD_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET,
});

export class CloudinaryUploader {
	private toDataURL(file: Express.Multer.File): string {
		const b64 = Buffer.from(file.buffer).toString('base64');
		return `data:${file.mimetype};base64,${b64}`;
	}

	private getPublicIdFromUrl(fileUrl: string): string {
		const fileNameUsingSubString = fileUrl.substring(
			fileUrl.lastIndexOf('/') + 1
		);
		return fileNameUsingSubString.substring(
			0,
			fileNameUsingSubString.lastIndexOf('.')
		);
	}

	async uploadSingle(file: Express.Multer.File) {
		const fileDataURL = this.toDataURL(file);
		return cloudinary.uploader.upload(fileDataURL, {
			resource_type: 'auto',
		});
	}

	async uploadMultiple(files: Express.Multer.File[]) {
		return Promise.all(files.map((file) => this.uploadSingle(file)));
	}

	async remove(fileUrl: string) {
		const publicId = this.getPublicIdFromUrl(fileUrl);
		return cloudinary.uploader.destroy(publicId);
	}
}
