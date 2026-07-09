import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('HLS fixture', () => {
    it('là manifest VOD hợp lệ và chỉ tham chiếu segment nội bộ', () => {
        const manifest = readFileSync(path.join(process.cwd(), 'tests/fixtures/mock.m3u8'), 'utf8');
        expect(manifest).toMatch(/^#EXTM3U/);
        expect(manifest).toContain('#EXTINF:');
        expect(manifest).toContain('#EXT-X-ENDLIST');
        expect(manifest).not.toMatch(/https?:\/\//);
    });
});
