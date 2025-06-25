import rateLimit from "express-rate-limit";
import express from "express";


const app = express();
export  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 2,
    message: "To many requets, please try again."
});

app.use(limiter)