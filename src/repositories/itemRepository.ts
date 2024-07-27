import Item, { IItem } from '../models/item';

export const createItem = (itemData: Partial<IItem>): Promise<IItem> => {
    const item = new Item(itemData);
    return item.save();
};

export const getItems = (): Promise<IItem[]> => {
    return Item.find().exec();
};

export const getItemById = (id: string): Promise<IItem | null> => {
    return Item.findById(id).exec();
};

export const updateItem = (id: string, itemData: Partial<IItem>): Promise<IItem | null> => {
    return Item.findByIdAndUpdate(id, itemData, { new: true }).exec();
};

export const deleteItem = (id: string): Promise<IItem | null> => {
    return Item.findByIdAndDelete(id).exec();
};
