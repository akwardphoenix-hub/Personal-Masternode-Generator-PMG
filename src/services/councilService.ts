// src/services/councilService.ts
// Offline-first council data service with safe remote->local fallback

type Proposal = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  votingEndsAt?: string;
  status?: 'active'|'pending'|'approved'|'rejected';
  votes?: { approve: number; reject: number; abstain: number };
};

const isTestOrOffline =
  import.meta.env.MODE === 'test' ||
  String(import.meta.env.VITE_OFFLINE_ONLY || '').toLowerCase() === 'true';

const LOCAL = {
  proposals: '/data/council-proposals.json',
  votes: '/data/council-votes.json',
  audit: '/data/audit-log.json'
};

async function fetchWithTimeout(url: string, ms = 4000): Promise<Response> {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), ms);
  try {
    return await fetch(url, { signal: c.signal });
  } finally {
    clearTimeout(t);
  }
}

async function safeJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getProposals(): Promise<Proposal[]> {
  // Try remote first (if configured and not offline), else local JSON
  const api = String(import.meta.env.VITE_CONGRESS_API || '').trim();
  if (!isTestOrOffline && api) {
    try {
      const r = await fetchWithTimeout(api, 4000);
      if (r.ok) return r.json();
    } catch {
      /* swallow; fallback to local */
    }
  }
  return safeJson<Proposal[]>(LOCAL.proposals);
}

export async function getVotes(): Promise<unknown[]> {
  return safeJson<unknown[]>(LOCAL.votes);
}

export async function getAuditLog(): Promise<unknown[]> {
  return safeJson<unknown[]>(LOCAL.audit);
}
