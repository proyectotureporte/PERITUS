import { createClient, type SanityClient } from '@sanity/client';

let _client: SanityClient | null = null;

export function getSanityClient(): SanityClient {
  if (!_client) {
    const projectId = process.env.SANITY_PROJECT_ID;
    if (!projectId) {
      throw new Error('SANITY_PROJECT_ID no está configurado');
    }
    _client = createClient({
      projectId,
      dataset: process.env.SANITY_DATASET || 'production',
      apiVersion: '2024-01-01',
      token: process.env.SANITY_API_TOKEN,
      useCdn: false,
    });
  }
  return _client;
}
