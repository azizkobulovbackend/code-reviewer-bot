import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { ReviewModule } from 'src/review/review.module';

@Module({
  imports: [ReviewModule],
  providers: [BotService],
})
export class BotModule {}
