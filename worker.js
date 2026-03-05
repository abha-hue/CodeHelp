import ai from "./ai.js";
import { AIResponseSchema } from "./aischema.js";
import { Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis();

const worker = new Worker(
    "code-analysis",
    async (job) => {
        const { code, language } = job.data;

        if (!code) {
            throw new Error("Code input is missing");
        }

        const result = await ai(code, language);

        let parsed;
        try {
            parsed = JSON.parse(result);
        } catch {
            throw new Error("Model returned invalid JSON");
        }

        const validation = AIResponseSchema.safeParse(parsed);

        if (!validation.success) {
            throw new Error("Model output failed schema validation");
        }

        return validation.data;
    },
    { connection }
);



// let result;
// try {
//     result = await ai(code, language);
// } catch (error) {
//     return res.status(502).json({ error: "LLM Error", id });
// }

// let parsed;

// try {
//     parsed = JSON.parse(result);
// } catch (err) {
//     const retryResult = await ai(`Your previous response was invalid JSON. Return ONLY valid JSON following the schema. ${code}`, language);
//     try {
//         parsed = JSON.parse(retryResult);
//     } catch (err2) {
//         return res.status(502).json({
//             error: "Model returned invalid JSON twice",
//             id
//         });
//     }
// }

// const validation = AIResponseSchema.safeParse(parsed);

// if (!validation.success) {
//     console.error(validation.error.format());
//     return res.status(502).json({ error: "Model returned invalid structure", id })
// }
// console.log(id, validation.data);
// return res.json(validation.data);