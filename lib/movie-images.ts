const NGUONC_IMAGE_HOST = 'phim.nguonc.com';
const NGUONC_POST_PATH = '/public/images/Post/';

export function normalizeLegacyNguoncPosterUrl(url: string): string {
    try {
        const parsed = new URL(url);
        if (parsed.hostname !== NGUONC_IMAGE_HOST || !parsed.pathname.startsWith(NGUONC_POST_PATH)) return url;

        const correctedPath = parsed.pathname.replace(/-1(\.[a-z0-9]+)$/i, '$1');
        if (correctedPath === parsed.pathname) return url;

        parsed.pathname = correctedPath;
        return parsed.toString();
    } catch {
        return url;
    }
}

