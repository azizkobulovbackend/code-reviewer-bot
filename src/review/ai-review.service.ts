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
You are a code review assistant.

1. Detect the programming language of the following code.
2. Provide a code review including:
   - Problems
   - Suggestions
   - Example Improvement (full improved code in the same language)

Respond in this exact format:

Problems:
1. ...
Suggestions:
1. ...
Example Improvement:
<full improved code here>

Code:
${code}
`;

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
    });

    return response.choices[0].message.content;
  }
}
