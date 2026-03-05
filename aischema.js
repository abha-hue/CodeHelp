import { z } from "zod";

export const TestCaseSchema = z.object({
    description: z.string().min(1, "Description cannot be empty"),
    input: z.string().min(1, "Input cannot be empty"),
    expectedOutput: z.string().min(1, "Expected output cannot be empty"),
});

export const ErrorSchema = z.object({
    issue: z.string().min(1, "Issue cannot be empty"),
    fix: z.string().min(1, "Fix cannot be empty"),
});

export const AIResponseSchema = z.object({
    explanation: z.string().min(1, "Explanation cannot be empty"),
    testCases: z
        .array(TestCaseSchema)
        .min(0, "At least one test case is required"),
    errors: z.array(ErrorSchema),
});