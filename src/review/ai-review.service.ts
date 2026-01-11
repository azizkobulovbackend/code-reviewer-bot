import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiReviewService {
  private client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async reviewCode(code: string): Promise<string> {
    const prompt = `
You are a professional code review assistant.

STRICT RULES:
- Respond ONLY in the format below
- Do NOT explain outside the format
- Infer the programming language automatically

FORMAT:

PROBLEMS:
- bullet points

SUGGESTIONS:
- bullet points

IMPROVED_CODE:
<only improved code, no markdown, no explanation>

CODE TO REVIEW:
${code}
`;

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      messages: [{ role: 'user', content: prompt }],
    });

    return response.choices[0].message.content ?? '';
  }
}
