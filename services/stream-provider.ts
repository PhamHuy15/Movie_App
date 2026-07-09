import type { StreamProvider } from '@/types/movie';
import { NguoncStreamProvider } from '@/services/nguonc-stream-provider';

export function getStreamProvider(): StreamProvider {
    return new NguoncStreamProvider();
}
