import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { InvoiceModule } from '../invoice.module';
import { MongooseModule } from '@nestjs/mongoose';

describe('InvoiceController (e2e)', () => {
  let app: INestApplication;

  // Set up the NestJS application before all tests
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/test-invoiceDB'), // Simplified Mongoose connection
        InvoiceModule, // Import the Invoice module to test its endpoints
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // Clean up after all tests
  afterAll(async () => {
    await app.close();
  });

  // Test the POST /invoices endpoint
  it('/POST invoices', () => {
    return request(app.getHttpServer())
      .post('/invoices')
      .send({
        customer: 'John Doe',
        amount: 150,
        reference: 'INV123',
        items: [{ sku: 'ITEM001', qt: 2 }],
      })
      .expect(201) // Expect HTTP status 201 (Created)
      .expect((res) => {
        expect(res.body.customer).toEqual('John Doe');
        expect(res.body.amount).toEqual(150);
        expect(res.body.reference).toEqual('INV123');
      });
  });

  // Test the GET /invoices/:id endpoint
  it('/GET invoices/:id', () => {
    const mockInvoice = {
      customer: 'John Doe',
      amount: 150,
      reference: 'INV123',
      items: [{ sku: 'ITEM001', qt: 2 }],
    };

    // First, create an invoice, then retrieve it by ID
    return request(app.getHttpServer())
      .post('/invoices')
      .send(mockInvoice)
      .expect(201)
      .then((res) => {
        const invoiceId = res.body._id;
        return request(app.getHttpServer())
          .get(`/invoices/${invoiceId}`)
          .expect(200) // Expect HTTP status 200 (OK)
          .expect((res) => {
            expect(res.body.customer).toEqual(mockInvoice.customer);
            expect(res.body.amount).toEqual(mockInvoice.amount);
          });
      });
  });
});
