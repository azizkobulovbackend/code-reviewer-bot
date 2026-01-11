import { Bot } from 'grammy';
import { ReviewService } from '../review/review.service';
import { AiReviewService } from '../review/ai-review.service';

export function registerBotHandlers(
  bot: Bot,
  reviewService: ReviewService,
  aiReviewService: AiReviewService,
) {
  // Track chats waiting for code
  const awaitingCode = new Set<number>();

  // /review command
  bot.command('review', async (ctx) => {
    awaitingCode.add(ctx.chat.id);
    await ctx.reply('📨 Send your code for AI review');
  });

  // Handle text messages
  bot.on('message:text', async (ctx) => {
    if (!awaitingCode.has(ctx.chat.id)) return;

    const text = ctx.message.text.trim();

    // 🚫 ignore commands (webhook sends them as text)
    if (text.startsWith('/')) {
      await ctx.reply('📨 Please send code, not a command.');
      return;
    }

    awaitingCode.delete(ctx.chat.id);

    const code = text;

    await ctx.reply('🤖 Analyzing with AI...');
    const aiFeedback = await aiReviewService.reviewCode(code);

    await ctx.reply(aiFeedback, { parse_mode: 'HTML' });
  });

  // Optional: /ping command for testing
  bot.command('ping', async (ctx) => {
    await ctx.reply('pong 🏓');
  });
}
