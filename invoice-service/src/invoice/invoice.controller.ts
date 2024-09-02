import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.createInvoice(createInvoiceDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoiceService.getInvoiceById(id);
  }

  @Get()
  findAll() {
    return this.invoiceService.getAllInvoices();
  }
}
