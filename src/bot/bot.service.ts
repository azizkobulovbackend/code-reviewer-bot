import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bot } from 'grammy';
import { registerBotHandlers } from './bot.handlers';
import { ReviewService } from 'src/review/review.service';
import { AiReviewService } from 'src/review/ai-review.service';

@Injectable()
export class BotService implements OnModuleInit, OnModuleDestroy {
  private readonly bot: Bot;

  constructor(
    private readonly config: ConfigService,
    reviewService: ReviewService,
    aiReviewService: AiReviewService,
  ) {
    const token = this.config.get<string>('BOT_TOKEN');
    if (!token) {
      throw new Error('BOT_TOKEN is missing');
    }

    this.bot = new Bot(token);

    // register all handlers here
    registerBotHandlers(this.bot, reviewService, aiReviewService);

    // optional global error handler
    this.bot.catch((err) => {
      console.error('🤖 Bot error:', err);
    });
  }

  async onModuleInit() {
    console.log('🤖 Telegram bot started');
    await this.bot.start();
  }

  async onModuleDestroy() {
    console.log('🤖 Telegram bot stopped');
    await this.bot.stop();
  }
}
