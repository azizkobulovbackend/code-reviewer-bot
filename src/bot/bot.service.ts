import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bot } from 'grammy';

@Injectable()
export class BotService {
  private bot: Bot;
  private channelId: string;

  constructor(config: ConfigService) {
    const token = config.get<string>('BOT_TOKEN');
    this.channelId = config.get<string>('TELEGRAM_CHANNEL_ID')!;

    if (!token || !this.channelId) {
      throw new Error('BOT_TOKEN or TELEGRAM_CHANNEL_ID missing');
    }

    this.bot = new Bot(token);
  }

  async sendMessage(text: string) {
    await this.bot.api.sendMessage(this.channelId, text, {
      parse_mode: 'HTML',
      disable_web_page_preview: false,
    });
  }
}
