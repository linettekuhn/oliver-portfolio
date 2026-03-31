import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";

const validRefreshTokens = new Set<string>();
const isProduction = env.NODE_ENV === "production";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (email !== env.ADMIN_EMAIL)
      throw new AppError(401, "Invalid credentials");

    const valid = await bcrypt.compare(password, env.ADMIN_PASSWORD_HASH);
    if (!valid) throw new AppError(401, "Invalid credentials");

    const accessToken = generateAccessToken(1); // single admin, id=1
    const refreshToken = generateRefreshToken(1);
    validRefreshTokens.add(refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, user: { email: env.ADMIN_EMAIL, name: "Oliver" } });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const oldToken = req.cookies.refreshToken;
    if (!oldToken || !validRefreshTokens.has(oldToken))
      throw new AppError(401, "Invalid refresh token");

    validRefreshTokens.delete(oldToken);

    const newAccessToken = generateAccessToken(1);
    const newRefreshToken = generateRefreshToken(1);
    validRefreshTokens.add(newRefreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken: newAccessToken,
      user: { email: env.ADMIN_EMAIL, name: "Oliver" },
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.refreshToken;
    if (token) validRefreshTokens.delete(token);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
