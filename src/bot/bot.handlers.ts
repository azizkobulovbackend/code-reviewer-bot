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
    awaitingCode.delete(ctx.chat.id);

    const code = ctx.message.text;

    // 1️⃣ Run rule-based review
    const basic = reviewService.review(code);

    // 2️⃣ Call AI for review + improved code
    await ctx.reply('🤖 Analyzing with AI...');
    const aiFeedback = await aiReviewService.reviewCode(code);

    // Extract Problems, Suggestions, Improved Code
    let problems = 'No problems found';
    let suggestions = 'No suggestions';
    let improvedCode = 'N/A';

    // Problems
    const problemsMatch = aiFeedback?.match(
      /Problems:([\s\S]*?)(Suggestions|$)/,
    );
    if (problemsMatch && problemsMatch[1])
      problems = problemsMatch[1].trim().replace(/\n\d+\./g, '\n•');

    // Suggestions
    const suggestionsMatch = aiFeedback?.match(
      /Suggestions.*?:([\s\S]*?)(Example|$)/,
    );
    if (suggestionsMatch && suggestionsMatch[1])
      suggestions = suggestionsMatch[1].trim().replace(/\n\d+\./g, '\n•');

    // Improved code
    const exampleMatch =
      aiFeedback?.match(/Example Improvement:([\s\S]*)$/) ||
      aiFeedback?.match(/### Revised Snippet:([\s\S]*)$/);
    if (exampleMatch && exampleMatch[1]) improvedCode = exampleMatch[1].trim();
    improvedCode = improvedCode
      .replace(/```[a-z]*\n/, '')
      .replace(/```$/, '')
      .trim();

    // Send messages
    await ctx.reply(
      `🧠 <b>Code Review</b>\n\n🚨 <b>AI Problems</b>\n• ${problems}\n\n💡 <b>AI Suggestions</b>\n• ${suggestions}`,
      { parse_mode: 'HTML' },
    );

    await ctx.reply(
      `🛠 <b>Improved Code</b>\n<pre><code>${improvedCode}</code></pre>`,
      { parse_mode: 'HTML' },
    );
  });

  // Optional: /ping command for testing
  bot.command('ping', async (ctx) => {
    await ctx.reply('pong 🏓');
  });
}
