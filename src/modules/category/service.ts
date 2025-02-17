import { IReqUser } from '../../utils/interfaces';
import { Category } from './interface';
import CategoryRepository from './repository';

class CategoryService {
	constructor(private readonly categoryRepository: CategoryRepository) {}

	async create(data: IReqUser) {
		return this.categoryRepository.create(data);
	}

	async update(id: string, data: any) {
		return this.categoryRepository.update(id, data);
	}

	async remove(id: string) {
		return this.categoryRepository.remove(id);
	}

	async findById(id: string) {
		return this.categoryRepository.findById(id);
	}

	async findAll(query: object, limit: number, page: number, search: string) {
		const data = await this.categoryRepository.findAll(
			query,
			limit,
			page,
			search
		);
		return data;
	}

	async count(query: object) {
		const count = await this.categoryRepository.count(query);
		return count;
	}
}

export default CategoryService;
