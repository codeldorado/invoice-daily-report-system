import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InvoiceDocument = Invoice & Document;

@Schema()
export class Item {
  @Prop({ required: true })
  sku: string;

  @Prop({ required: true })
  qt: number;
}

@Schema()
export class Invoice {
  @Prop({ required: true })
  customer: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  reference: string;

  @Prop({ required: true, default: Date.now })
  date: Date;

  @Prop({ type: [Item], required: true })
  items: Item[];
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
