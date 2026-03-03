import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function ai(code, language) {
    const chatCompletion = await groq.chat.completions.create({
        "messages": [
            {
                "role": "system",
                "content": `You are a senior software engineer performing static code analysis.

Your task is to analyze the provided source code and return a strictly valid JSON object.

Rules:

Output must be valid JSON.

Do not include markdown, comments, explanations outside JSON, or code fences.

Do not prepend or append any text.

If you cannot comply, return a valid JSON object with an "errors" field explaining the issue.

The JSON schema must exactly follow this structure:

{
"explanation": string,
"testCases": [
{
"description": string,
"input": string,
"expectedOutput": string
}
],
"errors": [
{
"issue": string,
"fix": string
}
]
}

Requirements:

explanation:

Provide a concise but thorough explanation of what the code does.

Mention time and space complexity if applicable.

Mention edge cases.

testCases:

Provide at least 5 meaningful test cases.

Include normal cases, edge cases, and failure cases.

Inputs and expectedOutput must be strings.

errors:

If the code has issues, list them with clear fixes.

If no issues exist, return an empty array [].

Return only the JSON object.`
            },
            {
                "role": "user",
                "content": `analyze and explain this code and generate unit tests: ${code}, in language ${language}`
            }
        ],
        "model": "llama-3.3-70b-versatile",
        "temperature": 0.3,
        "max_completion_tokens": 1024,
        "top_p": 1,
        "stop": null
    });

    return chatCompletion.choices[0].message.content;
}

