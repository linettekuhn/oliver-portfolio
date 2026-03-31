import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";
import fs from "fs";
import sharp from "sharp";

export async function uploadImage(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.file) throw new AppError(400, "No file uploaded");

    const { title, year, medium, surface, size } = req.body;
    if (!title || !year || !medium || !size)
      throw new AppError(400, "title, year, medium and size are required");

    // get real dimensions from the uploaded image
    const metadata = await sharp(req.file.path).metadata();
    const width = metadata.width!;
    const height = metadata.height!;

    // build new JSON entry
    const filename = req.file.filename;
    const newEntry = {
      src: `/images/originals/${filename}`,
      width,
      height,
      title,
      year: parseInt(year),
      medium,
      ...(surface ? { surface } : {}),
      size,
    };

    // read, update, and write back originals.json
    const jsonRaw = fs.readFileSync(env.JSON_PATH, "utf-8");
    const entries = JSON.parse(jsonRaw);
    entries.push(newEntry);
    fs.writeFileSync(env.JSON_PATH, JSON.stringify(entries, null, 2));

    res.status(201).json(newEntry);
  } catch (error) {
    // clean up uploaded file if something went wrong
    if (req.file?.path) fs.unlink(req.file.path, () => {});
    next(error);
  }
}
