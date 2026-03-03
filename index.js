import ai from "./ai.js";
import { AIResponseSchema } from "./aischema.js";

export async function main() {
    const result = await ai(`function add(a, b) {
        return a + b;
    }`, "javascript");

    let parsed;
    try {
        parsed = JSON.parse(result);
    } catch (error) {
        console.error("Invalid JSON response:", error);
    }

    const validation = AIResponseSchema.safeParse(parsed);

    if (!validation.success) {
        console.error(validation.error.format());
        throw new Error("Model output failed schema validation");
    }

    return validation.data;
}


