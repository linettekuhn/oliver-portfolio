export const env = {
  PORT: process.env.PORT || 5001,
  NODE_ENV: process.env.NODE_ENV as string,
  ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN ?? "http://localhost:5173",
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
  ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH as string,
  IMAGES_DIR: process.env.IMAGES_DIR as string,
  JSON_PATH: process.env.JSON_PATH as string,
};
