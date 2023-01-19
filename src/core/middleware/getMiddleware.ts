import { Request, Response, NextFunction } from "express";

import { roleValues } from "../data/roles";
import { decryptToken } from "../jwt/jsonwebtoken";

export function getAllUsersMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void | any {
  const auth_header = req.headers["authorization"];
  const token = auth_header && auth_header.split(" ")[1]; // Splitting because it goes: "Bearer [space] TOKEN"
  if (token === null) return res.sendStatus(401);

  let payload = decryptToken(token);

  if (!(roleValues[payload.role] >= 8))
    return res.send({
      detail: "You are not authorized to perform this action",
    });

  next();
}

export function getSpecificUserMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void | any {
  const auth_header = req.headers["authorization"];
  const token = auth_header && auth_header.split(" ")[1]; // Splitting because it goes: "Bearer [space] TOKEN"
  if (token === null) return res.sendStatus(401);

  let payload = decryptToken(token);
  console.log(roleValues[payload.role]);

  if (payload.username !== req.query.username && roleValues[payload.role] <= 7)
    return res.send({
      detail: "You are not authorized to perform this action",
    });

  if (payload.role <= 8)
    return res.send({
      detail: "You are not authorized to perform this action",
    });

  next();
}
