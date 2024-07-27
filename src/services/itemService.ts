import * as itemRepository from '../repositories/itemRepository';
import { IItem } from '../models/item';

export const createItem = (itemData: Partial<IItem>): Promise<IItem> => {
    return itemRepository.createItem(itemData);
};

export const getItems = (): Promise<IItem[]> => {
    return itemRepository.getItems();
};

export const getItemById = (id: string): Promise<IItem | null> => {
    return itemRepository.getItemById(id);
};

export const updateItem = (id: string, itemData: Partial<IItem>): Promise<IItem | null> => {
    return itemRepository.updateItem(id, itemData);
};

export const deleteItem = (id: string): Promise<IItem | null> => {
    return itemRepository.deleteItem(id);
};
