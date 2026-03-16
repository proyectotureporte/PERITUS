import { createClient, type SanityClient } from '@sanity/client';

let _client: SanityClient | null = null;

export function getSanityClient(): SanityClient {
  if (!_client) {
    const projectId = process.env.SANITY_PROJECT_ID;
    const token = process.env.SANITY_API_TOKEN;

    if (!projectId || !token) {
      throw new Error(
        'Sanity no está configurado. Asegúrese de configurar SANITY_PROJECT_ID y SANITY_API_TOKEN en las variables de entorno.'
      );
    }

    _client = createClient({
      projectId,
      dataset: process.env.SANITY_DATASET || 'production',
      apiVersion: '2024-01-01',
      token,
      useCdn: false,
    });
  }
  return _client;
}
