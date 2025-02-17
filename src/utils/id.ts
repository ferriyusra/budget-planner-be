import { customAlphabet } from 'nanoid';

export const getId = (): string => {
	const nanoId = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
	return nanoId(5);
};
