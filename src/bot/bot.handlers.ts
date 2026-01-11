import { Bot } from 'grammy';
import { ReviewService } from '../review/review.service';
import { AiReviewService } from '../review/ai-review.service';

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function registerBotHandlers(
  bot: Bot,
  reviewService: ReviewService,
  aiReviewService: AiReviewService,
) {
  const awaitingCode = new Set<number>();

  // /start
  bot.command('start', async (ctx) => {
    await ctx.reply('👋 Welcome!\n\nUse /review to send code for AI review.');
  });

  // /review
  bot.command('review', async (ctx) => {
    awaitingCode.add(ctx.chat.id);
    await ctx.reply('📨 Send your code for AI review');
  });

  // Handle text
  bot.on('message:text', async (ctx) => {
    if (!awaitingCode.has(ctx.chat.id)) return;

    const text = ctx.message.text.trim();

    // 🚫 Ignore commands
    if (text.startsWith('/')) {
      await ctx.reply('📨 Please send code, not a command.');
      return;
    }

    awaitingCode.delete(ctx.chat.id);

    await ctx.reply('🤖 Analyzing with AI...');

    const aiFeedback = await aiReviewService.reviewCode(text);

    // Parse AI response
    const problems =
      aiFeedback.match(/PROBLEMS:([\s\S]*?)SUGGESTIONS:/)?.[1]?.trim() ||
      'No problems found';

    const suggestions =
      aiFeedback.match(/SUGGESTIONS:([\s\S]*?)IMPROVED_CODE:/)?.[1]?.trim() ||
      'No suggestions';

    const improvedCode =
      aiFeedback.match(/IMPROVED_CODE:([\s\S]*)$/)?.[1]?.trim() || 'N/A';

    await ctx.reply(
      `🧠 <b>Code Review</b>

🚨 <b>Problems</b>
${escapeHtml(problems)}

💡 <b>Suggestions</b>
${escapeHtml(suggestions)}

🛠 <b>Improved Code</b>
<pre><code>${escapeHtml(improvedCode)}</code></pre>`,
      { parse_mode: 'HTML' },
    );
  });

  // /ping
  bot.command('ping', async (ctx) => {
    await ctx.reply('pong 🏓');
  });
}
