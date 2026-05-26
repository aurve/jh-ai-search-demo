# Just Holistics AI Search & Moderation Demo

---

# Getting Started

## Prerequisites

- Node.js 18+
- Docker (for Typesense)
- A Grok API key from [x.ai](https://x.ai)

## 1. Install dependencies

```bash
npm install
cd client && npm install && cd ..
```

## 2. Configure environment

Create a `.env` file in the project root:

```
TYPESENSE_API_KEY=your_typesense_key
GROK_API_KEY=your_grok_api_key
```

## 3. Start Typesense

```bash
docker run -p 8108:8108 -v "$(pwd)/typesense-data:/data" typesense/typesense:0.25.2 --api-key=xyz --enable-cors --data-dir /data
```

## 4. Seed the collection

```bash
npx ts-node server/createCollection.ts
npx ts-node server/importDocuments.ts
```

## 5. Start the server

```bash
npm run dev
```

## 6. Start the client

```bash
cd client && npm start
```

The app runs at `http://localhost:3000`. The API runs at `http://localhost:5000`.

---

AI-powered wellness search platform built with:
- React + TypeScript frontend
- Express + TypeScript backend
- Typesense semantic search
- Grok-powered query analysis
- Moderation and safety workflows

This project demonstrates intelligent wellness content retrieval, AI-assisted search enrichment, and safety-focused moderation UX.

---

# Features

- AI-assisted wellness search
- Typesense-powered retrieval
- Query intent analysis using Grok
- AI-generated search overviews
- Practitioner / protocol / community categorisation
- Safety risk detection
- Moderation suppression workflows
- Related search recommendations
- Saved protocol interactions
- Structured wellness content UI

---

# Architecture Overview

## Frontend
React + TypeScript application responsible for:
- Search UI
- Rendering AI overview
- Displaying Typesense results
- Rendering moderation/safety indicators
- Displaying Grok query analysis
- Categorised result sections

## Backend
Express + TypeScript API responsible for:
- Receiving search requests
- Calling Grok API for query analysis
- Building enriched search queries
- Fetching Typesense search results
- Applying moderation filtering
- Returning structured search responses

## Search Engine
Typesense handles:
- Full-text search
- Filtering
- Ranking
- Categorisation
- Search relevance

---

# Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript |
| Backend | Express + TypeScript |
| Search Engine | Typesense |
| AI Query Analysis | Grok |
| HTTP Client | Axios |
| Containerisation | Docker |

---

# Typesense Schema

The collection schema includes:

- id
- content_type
- title
- body
- tags
- category
- author_type
- created_at
- deep_link
- moderation_status
- risk_score

Content types supported:
- practitioner
- protocol
- community

Moderation states:
- approved
- requires_review
- suppressed

Risk scoring supports safety workflows for sensitive wellness topics.

---

# Grok Usage Explanation

Grok is used to analyse incoming user queries before retrieval.

The AI returns structured JSON including:

- intent
- entities
- risk_level
- query_expansions
- recommended_content_mix

Example:

```json
{
  "intent": "informational",
  "entities": ["sleep"],
  "risk_level": "low",
  "query_expansions": [
    "sleep wellness",
    "sleep protocol",
    "sleep practitioner"
  ]
}

---

# API Key Issue

During implementation, the provided Grok API credentials
appeared unavailable/inaccessible. The architecture and
integration layer were still fully implemented and tested
using fallback-compatible configurations.
