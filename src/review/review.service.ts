import { Injectable } from '@nestjs/common';
import { detectLanguage } from './detector';

@Injectable()
export class ReviewService {
  review(code: string) {
    const language = detectLanguage(code);
    const issues: string[] = [];
    const warnings: string[] = [];
    const good: string[] = [];

    if (code.includes('console.log')) {
      issues.push('❌ `console.log` found');
    }

    if (code.includes(' var ')) {
      issues.push('❌ Avoid using `var`');
    }

    if (language === 'ts' && code.includes(': any')) {
      issues.push('❌ Avoid using `any`');
    }

    const lines = code.split('\n').length;
    if (lines > 40) {
      warnings.push('⚠️ File is too long (>40 lines)');
    }

    if (code.includes('const ')) {
      good.push('✅ Uses `const`');
    }

    return {
      language,
      issues,
      warnings,
      good,
    };
  }
}
