import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import { resolve } from 'path';

describe('Build', () => {
  it('should compile without errors', () => {
    const clientDir = resolve(import.meta.dirname, '../..');
    const result = execSync('npm run build', {
      cwd: clientDir,
      encoding: 'utf-8',
      env: { ...process.env, NODE_ENV: 'production' },
    });
    expect(result).toContain('dist');
  });

  it('should produce index.html in dist', async () => {
    const fs = await import('fs');
    const distIndex = resolve(import.meta.dirname, '../../dist/index.html');
    expect(fs.existsSync(distIndex)).toBe(true);
    const content = fs.readFileSync(distIndex, 'utf-8');
    expect(content).toContain('root');
    expect(content).toContain('script');
  });
});
