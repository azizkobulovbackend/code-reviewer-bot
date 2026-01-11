import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiReviewService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async reviewCode(code: string) {
    const prompt = `
You are a senior code reviewer.

ALWAYS respond in EXACTLY this format:

Problems:
- list each problem

Suggestions:
- list suggestions

Improved Code:
\`\`\`
<improved code>
\`\`\`

Code to review:
\`\`\`
${code}
\`\`\`
`;

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return response.choices[0].message.content ?? '';
  }
}
