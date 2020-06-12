
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import { User } from '../models/user.model';
import { CustomResponse } from '../utils/customResponse';

const HEADER_TOKEN = 'x-access-token';
const MAX_AGE_COOKIE = 604800000; // In milliseconds -> 7d

export class AuthController {
  static async verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers[HEADER_TOKEN] as string;

    if (!token) {
      return res.status(401).send(CustomResponse({
        success: false,
        error: {
          code: 'auth/token-not-provided',
          message: 'Token is not provided'
        }
      }));
    }

    try {
      const user = await AuthController.getUserByToken(token);

      if (!user) {
        return res.status(400).send(CustomResponse({
          success: false,
          error: {
            code: 'user/token-invalid',
            message: 'The token you provided is invalid'
          }
        }));
      }

      (req as any).user = { id: user.id };
      next();
    } catch(error) {
      return res.status(400).send(CustomResponse({ success: false, error }));
    }
  }

  static login(req: Request, res: Response) {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).send(CustomResponse({
      success: false,
      error: {
        code: 'auth/bad-body',
        message: 'Enter the username and password'
      }
    }));

    return User.findOne({
      where: { username: username.toLocaleLowerCase() }
    })
    .then(user => {
      if(!user) {
        return res.status(404).send(CustomResponse({
          success: false,
          error: {
            code: 'user/not-found',
            message: 'User not found'
          }
        }));
      }

      if (!AuthController.comparePassword(user.password, password)) {
        return res.status(403).send(CustomResponse({
          success: false,
          error: {
            code: 'auth/incorrect-credentials',
            message: 'The credentials you provided is incorrect'
          }
        }));
      }

      const token = AuthController.generateToken(user.id);

      (user.password as any) = undefined;

      return res.status(200).send(CustomResponse({
        success: true,
        message: 'Authenticated user',
        data: {
          token,
          ...user.toJSON(),
        },
      }));
    })
    .catch(error => res.status(400).send(CustomResponse({ success: false, error })));
  }

  static async findUserByToken(req: Request, res: Response) {
    const token = req.headers[HEADER_TOKEN] as string;

    if (!token) {
      return res.status(400).send(CustomResponse({
        success: false,
        error: {
          code: 'auth/token-not-provided',
          message: 'Token is not provided'
        }
      }));
    }

    try {
      const user = await AuthController.getUserByToken(token);

      if (!user) {
        return res.status(401).send(CustomResponse({
          success: false,
          error: {
            code: 'user/token-invalid',
            message: 'The token you provided is invalid'
          }
        }));
      }

      return res.status(200).send(CustomResponse({
        success: true,
        data: user,
      }));
    } catch(error) {
      return res.status(400).send(CustomResponse({ success: false, error }));
    }
  }

  static getUserByToken(token: string) {
    const decoded = <any>jwt.verify(token, process.env.JWT_SECRET as string);
    
    return User.scope('withoutPassword').findOne({where: { id: decoded.userId }});
  }

  static hashPassword(password: string) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(12))
  }

  static comparePassword(hashPassword: string, password: string) {
    return bcrypt.compareSync(password, hashPassword);
  }

  static generateToken(id: number) {
    const JWT_SECRET = process.env.JWT_SECRET as string;
    const token = jwt.sign({ userId: id }, JWT_SECRET, { expiresIn: MAX_AGE_COOKIE / 1000 });

    return token;
  }
}
