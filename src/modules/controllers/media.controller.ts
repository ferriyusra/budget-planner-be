import { Response } from 'express';
import { IReqUser } from '../../utils/interfaces';
import { MediaService } from '../media/media.service';
import response from '../../utils/response';

export class MediaController {
	constructor(private readonly mediaService: MediaService) {}

	async single(req: IReqUser, res: Response) {
		if (!req.file) {
			return response.error(res, null, 'File not found');
		}

		try {
			const result = await this.mediaService.uploadSingle(req.file);
			return response.success(res, result, 'File successfully uploaded');
		} catch {
			return response.error(res, null, 'File failed to upload');
		}
	}

	async multiple(req: IReqUser, res: Response) {
		if (!req.files || req.files.length === 0) {
			return response.error(res, null, 'File are not exists');
		}

		try {
			const result = await this.mediaService.uploadMultiple(
				req.files as Express.Multer.File[]
			);
			return response.success(res, result, 'Files successfully uploaded');
		} catch {
			return response.error(res, null, 'Files failed to upload');
		}
	}

	async remove(req: IReqUser, res: Response) {
		try {
			const { fileUrl } = req.body as { fileUrl: string };
			const result = await this.mediaService.remove(fileUrl);
			return response.success(res, result, 'success remove file');
		} catch {
			return response.error(res, null, 'failed remove file');
		}
	}
}
