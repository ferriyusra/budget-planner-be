import { CloudinaryUploader } from '../../utils/uploader';

export class MediaService {
	constructor(private readonly uploader: CloudinaryUploader) {}

	async uploadSingle(file: Express.Multer.File) {
		return this.uploader.uploadSingle(file);
	}

	async uploadMultiple(files: Express.Multer.File[]) {
		return this.uploader.uploadMultiple(files);
	}

	async remove(fileUrl: string) {
		return this.uploader.remove(fileUrl);
	}
}
