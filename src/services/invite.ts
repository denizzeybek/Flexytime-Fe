
import { OpenAPI } from '@/client/core/OpenAPI';

export interface InviteLookup {
  Email: string;
  CompanyName: string;
  AlreadyAccepted: boolean;
}

export interface AcceptInviteBody {
  Token: string;
  Password: string;
  Fullname: string;
}

const base = () => (typeof OpenAPI.BASE === 'string' ? OpenAPI.BASE : '');

export async function lookupInvite(id: string, token: string): Promise<InviteLookup> {
  const res = await fetch(
    `${base()}/webapi/invite/${encodeURIComponent(id)}?token=${encodeURIComponent(token)}`,
    { method: 'GET' },
  );
  if (!res.ok) throw new Error(`Invite lookup failed: ${res.status}`);
  return (await res.json()) as InviteLookup;
}

export async function acceptInvite(id: string, body: AcceptInviteBody): Promise<InviteLookup> {
  const res = await fetch(`${base()}/webapi/invite/${encodeURIComponent(id)}/accept`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Invite accept failed: ${res.status}`);
  return (await res.json()) as InviteLookup;
}
