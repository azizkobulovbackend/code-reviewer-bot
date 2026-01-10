import { Body, Controller, Post } from '@nestjs/common';
import { BotService } from '../bot/bot.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly botService: BotService) {}

  @Post('github')
  async handleGithub(@Body() payload: any) {
    if (!payload.commits) return;

    for (const commit of payload.commits) {
      const message = `
<b>📦 New Commit</b>
👤 <b>Author:</b> ${commit.author.name}
📝 <b>Message:</b> ${commit.message}
🔑 <b>Commit:</b> <code>${commit.id.substring(0, 7)}</code>
🔗 <a href="${commit.url}">View commit</a>
      `;

      await this.botService.sendMessage(message);
    }

    return { ok: true };
  }
}
