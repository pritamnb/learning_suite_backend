import { Request, Response, NextFunction } from 'express';
import * as itemService from '../services/itemService';

export const createItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const item = await itemService.createItem(req.body);
        res.status(201).json(item);
    } catch (error) {
        next(error);
    }
};

export const getItems = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const items = await itemService.getItems();
        res.status(200).json(items);
    } catch (error) {
        next(error);
    }
};

export const getItemById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const item = await itemService.getItemById(req.params.id);
        if (item) {
            res.status(200).json(item);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        next(error);
    }
};

export const updateItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const updatedItem = await itemService.updateItem(req.params.id, req.body);
        if (updatedItem) {
            res.status(200).json(updatedItem);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        next(error);
    }
};

export const deleteItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const deletedItem = await itemService.deleteItem(req.params.id);
        if (deletedItem) {
            res.status(200).json({ message: 'Item deleted' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        next(error);
    }
};
