import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailSenderModule } from './email-sender/email-sender.module';

@Module({
  imports: [EmailSenderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
