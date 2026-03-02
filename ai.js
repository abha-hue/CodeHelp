import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function ai(prompt) {
    const chatCompletion = await groq.chat.completions.create({
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "model": "llama-3.3-70b-versatile",
        "temperature": 1,
        "max_completion_tokens": 1024,
        "top_p": 1,
        "stream": true,
        "stop": null
    });

    for await (const chunk of chatCompletion) {
        process.stdout.write(chunk.choices[0]?.delta?.content || '');
    }
}

