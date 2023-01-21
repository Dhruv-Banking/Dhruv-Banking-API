import { Request, Response, NextFunction } from "express";

import { roles, roleValues } from "../data/roles";
import { decryptToken } from "../jwt/jsonwebtoken";

export function forgotPasswordFromTokenMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void | any {
  const auth_header = req.headers["authorization"];
  const token = auth_header && auth_header.split(" ")[1]; // Splitting because it goes: "Bearer [space] TOKEN"
  if (token === null) return res.sendStatus(401);

  let payload = decryptToken(token);

  if (!(roleValues[payload.role] === 5))
    return res
      .status(400)
      .send({ detail: "You are not authorized to perform this action" });

  next();
}

export function transferMoneyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void | any {
  const auth_header = req.headers["authorization"];
  const token = auth_header && auth_header.split(" ")[1]; // Splitting because it goes: "Bearer [space] TOKEN"
  if (token === null) return res.sendStatus(401);

  let payload = decryptToken(token);
  let username = req.query.username;
  let tokenName = payload.username;

  if (!(roleValues[payload.role] >= 7))
    return res
      .status(400)
      .send({ detail: "You are not authorized to perform this action" });

  if (username !== tokenName) {
    res.status(400);
    return res.send({ detail: "Please use the same token as the user" });
  }

  next();
}
