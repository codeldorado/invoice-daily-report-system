import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class EmailSenderService {
  constructor() {
    this.consumeSalesReport();
  }

  private async consumeSalesReport() {
    try {
      const connection = await amqp.connect('amqp://rabbitmq:5672');
      const channel = await connection.createChannel();
      const queue = 'daily_sales_report';

      await channel.assertQueue(queue, { durable: true });

      channel.consume(queue, async (msg) => {
        if (msg !== null) {
          const report = JSON.parse(msg.content.toString());
          await this.sendEmail(report);
          channel.ack(msg);
        }
      });

      console.log('Listening for sales reports...');
    } catch (error) {
      console.error('Error consuming sales report:', error);
    }
  }

  private async sendEmail(report: any) {
    // Mock or real implementation for sending the report via email
    console.log('Sending email with report:', report);
  }
}
