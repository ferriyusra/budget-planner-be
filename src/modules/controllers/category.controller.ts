import response from '../../utils/response';
import { Response } from 'express';
import { IPaginationQuery, IReqUser } from '../../utils/interfaces';
import { categoryDTO } from '../category/models/category.model';
import CategoryService from '../category/service';
import { isValidObjectId } from 'mongoose';

class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	async create(req: IReqUser, res: Response) {
		try {
			await categoryDTO.validate(req.body);
			const result = await this.categoryService.create(req.body);
			return response.success(res, result, 'Success create category');
		} catch (error) {
			return response.error(res, error, 'Failed create category');
		}
	}

	async findAll(req: IReqUser, res: Response) {
		const {
			page = 1,
			limit = 10,
			search,
		} = req.query as unknown as IPaginationQuery;
		try {
			const query = {};

			if (search) {
				Object.assign(query, {
					$or: [
						{
							name: { $regex: search, $options: 'i' },
						},
						{
							description: { $regex: search, $options: 'i' },
						},
					],
				});
			}

			const result = await this.categoryService.findAll(
				query,
				+limit,
				+page,
				search
			);
			const count = await this.categoryService.count(query);

			return response.pagination(
				res,
				result,
				{
					total: count,
					totalPages: Math.ceil(count / limit),
					current: page,
				},
				'Success find all category'
			);
		} catch (error) {
			return response.error(res, error, 'Failed find all category');
		}
	}

	async findOne(req: IReqUser, res: Response) {
		try {
			const { id } = req.params;
			if (!isValidObjectId(id)) {
				return response.notfound(res, 'Category not found');
			}

			const result = await this.categoryService.findById(id);

			if (!result) {
				return response.notfound(res, 'Category not found');
			}

			return response.success(res, result, 'Success find one category');
		} catch (error) {
			return response.error(res, error, 'Failed find one category');
		}
	}

	async update(req: IReqUser, res: Response) {
		try {
			const { id } = req.params;
			if (!isValidObjectId(id)) {
				return response.notfound(res, 'Category not found');
			}

			const result = await this.categoryService.update(id, req.body);
			if (!result) {
				return response.notfound(res, 'Category not found');
			}

			return response.success(res, result, 'Success update category');
		} catch (error) {
			return response.error(res, error, 'Failed update category');
		}
	}

	async remove(req: IReqUser, res: Response) {
		try {
			const { id } = req.params;
			if (!isValidObjectId(id)) {
				return response.notfound(res, 'Category not found');
			}

			const result = await this.categoryService.remove(id);
			if (!result) {
				return response.notfound(res, 'Category not found');
			}

			return response.success(res, result, 'Success remove category');
		} catch (error) {
			return response.error(res, error, 'Failed remove category');
		}
	}
}

export default CategoryController;
