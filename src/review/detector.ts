export function detectLanguage(code: string): 'js' | 'ts' {
  if (
    code.includes(': ') ||
    code.includes('interface ') ||
    code.includes('type ') ||
    code.includes('implements ') ||
    code.includes('enum ')
  ) {
    return 'ts';
  }
  return 'js';
}
