import { Router } from "express";
import multer from "multer";
import path from "path";
import { authMiddleware } from "../middleware/authMiddleware";
import { uploadImage } from "../controllers/upload.controller";
import { env } from "../config/env";

// set destination and filepath for file save
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, env.IMAGES_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = path
      .basename(file.originalname, ext)
      .toUpperCase()
      .replace(/\s+/g, "_");
    cb(null, `${name}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB file size limit
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    cb(null, allowed.includes(file.mimetype));
  },
});

const router = Router();

// tell multer to look for one file in the request under field name "image"
router.post("/", authMiddleware, upload.single("image"), uploadImage);
export default router;
