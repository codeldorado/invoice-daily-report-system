import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvoiceService } from '../invoice.service';
import { Invoice, InvoiceDocument } from '../../schemas/invoice.schema';

// Mock data for testing
const mockInvoice = {
  customer: 'John Doe',
  amount: 150,
  reference: 'INV123',
  date: new Date(),
  items: [{ sku: 'ITEM001', qt: 2 }],
};

// Mock Mongoose model with methods used in the service
const mockInvoiceModel = {
  find: jest.fn().mockResolvedValue([mockInvoice]),
  findById: jest.fn().mockResolvedValue(mockInvoice),
  create: jest.fn().mockResolvedValue(mockInvoice),
  save: jest.fn().mockResolvedValue(mockInvoice),
};

describe('InvoiceService', () => {
  let service: InvoiceService;
  let model: Model<InvoiceDocument>;

  // Set up the testing module before each test
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: getModelToken(Invoice.name),
          useValue: mockInvoiceModel,
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    model = module.get<Model<InvoiceDocument>>(getModelToken(Invoice.name));
  });

  // Test if the service is defined
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test for creating an invoice
  describe('createInvoice', () => {
    it('should create an invoice', async () => {
      jest.spyOn(model, 'create').mockResolvedValueOnce(mockInvoice as any);
      const result = await service.createInvoice(mockInvoice);
      expect(result).toEqual(mockInvoice);
    });
  });

  // Test for retrieving an invoice by ID
  describe('getInvoiceById', () => {
    it('should return an invoice by ID', async () => {
      jest.spyOn(model, 'findById').mockResolvedValueOnce(mockInvoice as any);
      const result = await service.getInvoiceById('someId');
      expect(result).toEqual(mockInvoice);
    });

    it('should throw an error if the invoice is not found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValueOnce(null);
      await expect(service.getInvoiceById('wrongId')).rejects.toThrow();
    });
  });

  // Test for retrieving all invoices
  describe('getAllInvoices', () => {
    it('should return all invoices', async () => {
      const result = await service.getAllInvoices();
      expect(result).toEqual([mockInvoice]);
    });
  });
});
