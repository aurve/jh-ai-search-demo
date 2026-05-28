# Just Holistics AI Search & Moderation Demo

AI-powered wellness search and moderation platform built with:

* React + TypeScript frontend
* Express + TypeScript backend
* Typesense search infrastructure
* Grok-powered query intelligence
* AI-generated wellness overviews
* Safety-focused moderation workflows

This project demonstrates intelligent wellness content retrieval, grounded AI search experiences, and health-focused moderation orchestration.

---

# Getting Started

## Prerequisites

* Node.js 18+
* Docker
* Grok API Key from xAI

---

# Installation

## 1. Install dependencies

```bash
npm install
cd client && npm install && cd ..
```

---

## 2. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=5000

TYPESENSE_HOST=your_typesense_host
TYPESENSE_PORT=443
TYPESENSE_PROTOCOL=https
TYPESENSE_API_KEY=your_typesense_api_key
COLLECTION_NAME=listings

GROK_API_KEY=your_grok_api_key
```

---

## 3. Start the backend

```bash
npm run dev
```

Backend runs on:

```txt
http://localhost:5000
```

---

## 4. Start the frontend

```bash
cd client && npm start
```

Frontend runs on:

```txt
http://localhost:3000
```

---

# Features

* AI-assisted wellness search
* Typesense-powered retrieval
* Grok query intelligence analysis
* AI-generated wellness overviews
* Practitioner / protocol / community categorisation
* Grounded AI response generation
* Risk-aware moderation workflows
* Safety disclaimer handling
* Structured wellness discovery UX
* Related search recommendations
* Saved protocol interactions
* Retrieval transparency panel

---

# Architecture Overview

## Frontend (React + TypeScript)

Responsible for:

* Search interface
* AI overview rendering
* Displaying Typesense retrieval results
* Rendering moderation and safety indicators
* Displaying Grok query analysis
* Categorised content sections
* Wellness content interaction workflows

---

## Backend (Express + TypeScript)

Responsible for:

* Receiving user search queries
* Calling Grok for query intelligence analysis
* Building expanded retrieval queries
* Fetching Typesense search results
* Applying moderation-aware orchestration
* Generating grounded AI overviews
* Returning structured search responses

---

## Search Layer (Typesense)

Typesense handles:

* Full-text keyword search
* Search relevance ranking
* Result retrieval
* Wellness content discovery
* Retrieval orchestration support

---

# Tech Stack

| Layer             | Technology           |
| ----------------- | -------------------- |
| Frontend          | React + TypeScript   |
| Backend           | Express + TypeScript |
| Search Engine     | Typesense            |
| AI Query Analysis | Grok                 |
| HTTP Client       | Axios                |
| Containerisation  | Docker               |

---

# Retrieval Schema Mapping

The implementation uses a unified wellness retrieval structure aligned to the assessment architecture.

Displayed retrieval fields include:

* id
* content_type
* title
* body
* tags
* category
* author_type
* created_at
* deep_link
* moderation_status
* risk_score

Supported content categories include:

* practitioner
* protocol
* post
* comment

Moderation states include:

* approved
* flagged
* requires_review

Risk scoring supports moderation-aware wellness retrieval workflows.

---

# Grok Query Intelligence

Grok is used to analyse incoming user queries before retrieval.

The AI returns structured JSON containing:

* intent
* entities
* risk_level
* query_expansions
* recommended_content_mix

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
  ],
  "recommended_content_mix": {
    "practitioners": 30,
    "protocols": 40,
    "community": 30
  }
}
```

This analysis drives retrieval orchestration and AI overview generation.

---

# AI Overview Generation

The platform generates grounded AI wellness overviews using:

* User query
* Grok query analysis
* Retrieved Typesense content
* Wellness categorisation logic

The AI overview:

* Uses only retrieved wellness content
* Avoids external hallucinated information
* Provides non-directive wellness summaries
* Surfaces practitioners, protocols, and community discussions
* Suggests safe next actions

---

# Moderation & Safety Logic

The platform includes moderation-aware wellness retrieval workflows.

## Ingestion-Time Moderation

Content moderation workflows support:

* Risk classification
* Claim confidence analysis
* Human review escalation

High-risk wellness content may be flagged for review.

---

## Query-Time Safety Handling

For elevated-risk queries, the system can:

* Show safety disclaimers
* Prioritise practitioner-oriented content
* Reduce risky protocol visibility
* Apply moderation-aware orchestration

---

# User Interface

The demo interface includes:

* Raw user query
* Grok analysis JSON
* Typesense retrieval results
* Grounded AI overview
* Categorised wellness sections
* Moderation indicators
* Retrieval transparency panels

---

# Known Limitations

* Moderation workflows are demonstration-oriented and not production-grade
* Embedding-based semantic retrieval is not implemented
* Wellness categorisation uses heuristic orchestration logic
* Retrieval quality depends on available indexed wellness content
