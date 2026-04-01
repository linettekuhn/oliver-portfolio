import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";
import fs from "fs";
import sharp from "sharp";
import path from "path";

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
      src: `/images/${filename}`,
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

export async function deleteImage(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const filename = req.params.filename as string;
    if (!filename) throw new AppError(400, "Filename is required");

    const jsonRaw = fs.readFileSync(env.JSON_PATH, "utf-8");
    const entries: { src: string }[] = JSON.parse(jsonRaw);

    const src = `/images/${filename}`;
    const exists = entries.some((e) => e.src === src);
    if (!exists) throw new AppError(404, "Image not found in records");

    const updated = entries.filter((e) => e.src !== src);
    fs.writeFileSync(env.JSON_PATH, JSON.stringify(updated, null, 2));

    const filePath = path.join(env.IMAGES_DIR, filename);
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete file from disk:", err);
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
