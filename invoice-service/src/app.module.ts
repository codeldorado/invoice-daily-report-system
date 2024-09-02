import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { InvoiceModule } from './invoice/invoice.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:27017/invoiceDB'),
    ScheduleModule.forRoot(),
    InvoiceModule,
  ],
})
export class AppModule {}
