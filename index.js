
import express from "express";
import { analyzeQueue } from "./queue.js";

const app = express();
app.use(express.json());

const requestValidator = (req, res, next) => {
    const { code, language } = req.body;
    if (typeof code !== "string" || typeof language !== "string") {
        return res.status(400).json({ error: "Invalid code or language" });
    }
    if (!code.trim() || !language.trim()) {
        return res.status(400).json({ error: "Empty code or language" });
    }
    next();
}

app.post('/analyze', requestValidator, async (req, res) => {
    const { code, language } = req.body;
    const job = await analyzeQueue.add("code-analysis", {
        code,
        language
    });
    return res.json({ id: job.id, status: "queued" });
})

// app.get("/status/:id", async (req, res) => {
//     const { id } = req.params;
//     const job = await analyzeQueue.getJob(id);
//     if (!job) {
//         return res.status(404).json({ error: "Job not found" });
//     }
//     return res.json({ status: job.getState() });
// })

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});


