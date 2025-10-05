# Personal Masternode Generator (PMG)

Create a private, portable AI “masternode” from your own data (with consent). OAuth ingest → normalize → embed → retrieve → reply. Export to other agents (OpenAI Assistants, MCP). Privacy-first, revoke-anytime.

## Features
- 🔐 Consent-first connectors (OAuth), no password scraping
- 🧠 Memory engine (SQLite + embeddings) with “sleep & rehearse” mode
- 🧩 Pluggable LLMs (OpenAI / local Ollama)
- 🧳 Exporters: OpenAI Assistant JSON, MCP tool config, full archive
- 🛡️ Guardrails (prompt, policy, redaction, rate limits)
- 💤 Divergent Sleep: off-duty rehearsal loops that never touch production logs

## Quick Start
```bash
# 1) Clone & setup
pnpm i    # or npm i / yarn

# 2) Copy env
cp .env.example .env
# Fill: OPENAI_API_KEY=..., OLLAMA_HOST=http://localhost:11434, NEXTAUTH_SECRET=...

# 3) Dev web app
cd apps/web && pnpm dev

# 4) Core demo (ingest + chat)
pnpm -w tsx packages/core/src/index.ts
