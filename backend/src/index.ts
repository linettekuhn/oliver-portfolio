import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes";
import uploadRouter from "./routes/upload.routes";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";

const app = express();
app.use(cookieParser());
app.use(requestLogger);
app.use(cors({ origin: env.ALLOWED_ORIGIN, credentials: true }));
app.use(express.json());
app.use(errorHandler);

app.use("/auth", authRouter);
app.use("/upload", uploadRouter);

app.listen(env.PORT, () =>
  console.log(`Oliver API running on port ${env.PORT}`),
);
