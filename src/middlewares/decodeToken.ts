import { NextFunction, Request, Response } from "express";
import myResponse from "../system/myResponse";

const jwt = require("jsonwebtoken");

export default async function decodeToken(
   req: Request | any,
   res: Response,
   next: NextFunction
) {
   res.locals.tokenUsername = "";

   try {
      const auth = req.headers.authorization;
      if (!auth || !auth.startsWith("Bearer "))
         return myResponse(res, false, "Unauthorized", 401);

      const token = auth.split(" ")[1];

      const decode = jwt.verify(token, "nguyenhuudat") as {
         username: string;
         role: string;
      };

      res.locals.tokenUsername = decode.username;

      next();
   } catch (error) {
      return myResponse(
         res,
         false,
         "The access token provided is expired, revoked, malformed or invalid for other reasons",
         401
      );
   }
}
