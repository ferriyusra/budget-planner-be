import { Connection, Model } from 'mongoose';
import CategoryModel, { Category } from './models/category.model';

class CategoryRepository {
	private readonly categoryModel: Model<Category>;

	constructor(private readonly db: Connection) {
		this.categoryModel = db.model<Category>('Category', CategoryModel.schema);
	}

	async create(data: any) {
		return this.categoryModel.create(data);
	}

	async findById(id: string) {
		return this.categoryModel.findById(id);
	}

	async findAll(query: object, limit: number, page: number, search: string) {
		const data = await this.categoryModel
			.find(query)
			.limit(limit)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.exec();

		return data;
	}

	async count(query: object) {
		return this.categoryModel.countDocuments(query);
	}

	async update(id: string, data: any) {
		const updated = await this.categoryModel.findByIdAndUpdate(id, data, {
			new: true,
		});
		return updated;
	}

	async remove(id: string) {
		const affectedRow = await this.categoryModel.findByIdAndDelete(id, {
			new: true,
		});
		return affectedRow;
	}
}

export default CategoryRepository;
