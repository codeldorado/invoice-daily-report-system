import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Invoice, InvoiceDocument } from '../schemas/invoice.schema';
import * as amqp from 'amqplib';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
  ) {}

  async createInvoice(createInvoiceDto: any): Promise<Invoice> {
    const newInvoice = new this.invoiceModel(createInvoiceDto);
    return newInvoice.save();
  }

  async getInvoiceById(id: string): Promise<Invoice> {
    const invoice = await this.invoiceModel.findById(id).exec();
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    return invoice;
  }

  async getAllInvoices(): Promise<Invoice[]> {
    return this.invoiceModel.find().exec();
  }

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async generateDailySalesReport() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const invoices = await this.invoiceModel
      .find({
        date: { $gte: startOfDay },
      })
      .exec();

    const totalSales = invoices.reduce(
      (sum, invoice) => sum + invoice.amount,
      0,
    );
    const itemSales = invoices
      .flatMap((invoice) => invoice.items)
      .reduce((acc, item) => {
        acc[item.sku] = (acc[item.sku] || 0) + item.qt;
        return acc;
      }, {});

    const report = {
      totalSales,
      itemSales,
    };

    console.log('Generated Daily Sales Report:', report);
    await this.publishSalesReport(report);
  }

  private async publishSalesReport(report: any) {
    try {
      const connection = await amqp.connect('amqp://rabbitmq:5672');
      const channel = await connection.createChannel();
      const queue = 'daily_sales_report';

      await channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(report)));

      console.log('Published sales report to RabbitMQ:', report);

      setTimeout(() => {
        connection.close();
      }, 500);
    } catch (error) {
      console.error('Error publishing sales report to RabbitMQ:', error);
    }
  }
}
