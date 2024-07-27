import { Schema, model, Document } from 'mongoose';

export interface IItem extends Document {
    name: string;
    description: string;
    price: number;
}

const itemSchema = new Schema<IItem>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
});

const Item = model<IItem>('Item', itemSchema);

export default Item;
