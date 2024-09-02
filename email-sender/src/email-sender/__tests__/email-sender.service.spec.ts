import { Test, TestingModule } from '@nestjs/testing';
import { EmailSenderService } from '../email-sender.service';

// Mock implementation of amqplib to simulate RabbitMQ connections and message consumption
jest.mock('amqplib', () => ({
  connect: jest.fn().mockResolvedValue({
    createChannel: jest.fn().mockResolvedValue({
      assertQueue: jest.fn(),
      consume: jest.fn((queue, cb) => {
        // Simulate message consumption by calling the callback with a mock message
        const message = {
          content: Buffer.from(
            JSON.stringify({
              totalSales: 300,
              itemSales: { ITEM001: 3 },
            }),
          ),
        };
        cb(message); // Call the callback function to simulate consuming a message
      }),
    }),
  }),
}));

describe('EmailSenderService', () => {
  let service: EmailSenderService;

  // Set up the testing module before each test
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailSenderService],
    }).compile();

    service = module.get<EmailSenderService>(EmailSenderService); // Get the EmailSenderService instance
  });

  // Test if the service is defined
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test the consumption and processing of sales reports
  it('should consume and process sales report', async () => {
    const sendEmailSpy = jest
      .spyOn(service as any, 'sendEmail')
      .mockResolvedValueOnce(undefined);
    await service['consumeSalesReport'](); // Call the private consumeSalesReport method
    expect(sendEmailSpy).toHaveBeenCalledWith({
      totalSales: 300,
      itemSales: { ITEM001: 3 },
    });
  });
});
