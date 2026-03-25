import { createClient as createSanityClient, type SanityClient } from '@sanity/client';

const config = {
  projectId: process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
};

export const client = createSanityClient(config);

export const writeClient = createSanityClient({
  ...config,
  token: process.env.SANITY_API_TOKEN!,
});

// Legacy compat
export function getSanityClient(): SanityClient {
  return writeClient;
}
