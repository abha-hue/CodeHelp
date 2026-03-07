# CodeHelp Backend

CodeHelp is an AI-powered code analysis API that evaluates code snippets, explains their functionality, generates unit tests, and identifies potential bugs or improvements. It uses a robust background job processing architecture with BullMQ and Redis to handle asynchronous AI inference tasks, leveraging Groq's high-speed Llama 3 API for near-instant results.

## Features

- **Asynchronous Code Analysis:** Submit code for analysis without blocking the main event loop.
- **AI-Powered Insights:** Uses Groq's high-speed inference API with the Llama 3 70B Versatile model.
- **Structured JSON Responses:** Guaranteed schema-compliant analysis using Zod validation.
- **Job Status Polling:** Endpoints to check the status of queued, processing, or failed analysis jobs.
- **Redis & BullMQ:** Reliable and scalable job queueing background worker system.

## Tech Stack

- **Node.js**: JavaScript Runtime
- **Express.js**: Web API framework
- **BullMQ & IORedis**: Job queue and background processing
- **Groq SDK**: LLM inference
- **Zod**: Output schema validation

## Prerequisites

- Node.js installed
- Redis server running locally or accessible
- [Groq API Key](https://console.groq.com/)

## Configuration

Create a `.env` file in the root directory and add your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key_here
```

## Running the Application

To start the API development server:

```bash
npm run dev
```

Since the analysis tasks are handled asynchronously via a BullMQ job queue, you must also run the background worker to process these jobs. Open a separate terminal window and run:

```bash
node worker.js
```

## API Reference

### 1. Submit Code for Analysis

**Endpoint:** `POST /analyze`

Add a new piece of code to the analysis queue.

**Request Body:**
```json
{
  "code": "function add(a, b) { return a + b; }",
  "language": "javascript"
}
```

**Response (200 OK):**
Returns a job `id` that can be polled for results.
```json
{
  "id": "1",
  "status": "queued"
}
```

### 2. Check Job Status

**Endpoint:** `GET /status/:id`

Poll the status and result of a specific background job.

**Response (Processing/Queued):**
```json
{
  "status": "active"
}
```

**Response (Completed):**
```json
{
  "status": "completed",
  "result": {
    "explanation": "This function takes two numerical parameters `a` and `b`...",
    "testCases": [
      {
        "description": "Adds two positive numbers",
        "input": "add(2, 3)",
        "expectedOutput": "5"
      }
    ],
    "errors": []
  }
}
```

**Response (Validation Failed/Error):**
```json
{
  "status": "failed",
  "error": "Model output failed schema validation"
}
```

## Project Structure

- `index.js` - Main Express server implementation and API routes definition
- `worker.js` - Background worker that listens to the `code-analysis` BullMQ queue and executes AI inference
- `ai.js` - Defines the Groq SDK integration, LLM instructions prompt, and system message setup
- `aischema.js` - Zod schema validation rules used to ensure strictly formatted JSON outcomes from the AI
- `queue.js` - BullMQ queue definition and setup connected to local Redis
