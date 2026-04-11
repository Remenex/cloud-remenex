import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET = process.env.VIDEO_TOKEN_SECRET!;

type VideoTokenPayload = {
  fileId: string;
  userId?: string;
  context: "embed" | "dashboard";
};

export function generateVideoToken(payload: VideoTokenPayload) {
  return jwt.sign(payload, SECRET, {
    expiresIn: "1h",
  });
}

export function verifyVideoToken(token: string): VideoTokenPayload | null {
  try {
    return jwt.verify(token, SECRET) as VideoTokenPayload;
  } catch {
    return null;
  }
}

