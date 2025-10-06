import React, { useEffect, useState } from 'react';
import { getProposals } from './services/councilService';

interface Proposal {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  votingEndsAt?: string;
  status?: 'active' | 'pending' | 'approved' | 'rejected';
  votes?: { approve: number; reject: number; abstain: number };
}

function App() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getProposals();
        setProposals(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load proposals');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Personal Masternode Generator (PMG)</h1>
      <p>Council Proposals Dashboard</p>
      
      {loading && <p>Loading proposals...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      {!loading && !error && (
        <div>
          <h2>Active Proposals ({proposals.length})</h2>
          {proposals.length === 0 ? (
            <p>No proposals found.</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {proposals.map((proposal) => (
                <div
                  key={proposal.id}
                  style={{
                    border: '1px solid #ccc',
                    padding: '1rem',
                    borderRadius: '8px',
                  }}
                >
                  <h3>{proposal.title}</h3>
                  {proposal.description && <p>{proposal.description}</p>}
                  <div>
                    <strong>Status:</strong> {proposal.status || 'unknown'}
                  </div>
                  {proposal.votes && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <strong>Votes:</strong> Approve: {proposal.votes.approve}, 
                      Reject: {proposal.votes.reject}, 
                      Abstain: {proposal.votes.abstain}
                    </div>
                  )}
                  <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
                    Created: {new Date(proposal.createdAt).toLocaleDateString()}
                    {proposal.votingEndsAt && (
                      <> | Voting ends: {new Date(proposal.votingEndsAt).toLocaleDateString()}</>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
