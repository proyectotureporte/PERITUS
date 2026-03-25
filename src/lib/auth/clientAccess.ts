import { client } from '@/lib/sanity/client';

export async function getClientIdForUser(userId: string): Promise<string | null> {
  // JWT sub is registroPeritus._id — clientRef apunta al crmClient
  const result = await client.fetch<{ clientRefId: string } | null>(
    `*[_type == "registroPeritus" && _id == $userId && activo == true][0]{
      "clientRefId": clientRef._ref
    }`,
    { userId }
  );

  return result?.clientRefId || null;
}

export async function verifyClientOwnsCase(
  userId: string,
  caseId: string
): Promise<{ owns: boolean; clientId: string | null }> {
  const clientId = await getClientIdForUser(userId);
  if (!clientId) return { owns: false, clientId: null };

  const caseData = await client.fetch<{ clientRef: string } | null>(
    `*[_type == "case" && _id == $caseId][0]{ "clientRef": client._ref }`,
    { caseId }
  );

  return {
    owns: caseData?.clientRef === clientId,
    clientId,
  };
}
