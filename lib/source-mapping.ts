import { z } from 'zod';

export const movieSourceMappingSchema = z.object({
    nguoncSlug: z
        .string()
        .trim()
        .min(1)
        .max(200)
        .regex(/^[a-z0-9-]+$/),
    provider: z.string().trim().min(2).max(50),
    type: z.enum(['movie', 'series']),
});

export function createMappingKey(input: z.input<typeof movieSourceMappingSchema>) {
    const mapping = movieSourceMappingSchema.parse(input);
    return `${mapping.provider}:nguonc:${mapping.nguoncSlug}`;
}
