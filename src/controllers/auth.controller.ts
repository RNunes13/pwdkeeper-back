
import { User } from '../models/user.model';
import { Auth } from '../models/auth.model';
import { CustomResponse } from '../utils/customResponse';
import { Request, Response, NextFunction } from "express";

const HEADER_TOKEN = 'x-access-token';

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
      const user = await Auth.getUserByToken(token);

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

    if (!username || !password) return res.status(200).send(CustomResponse({
      success: false,
      error: {
        code: 'auth/bad-body',
        message: 'Enter the username and password'
      }
    }));

    return User.scope('active').findOne({
      where: { username: username.toLocaleLowerCase() }
    })
    .then(user => {
      if(!user) {
        return res.status(200).send(CustomResponse({
          success: false,
          error: {
            code: 'user/not-found',
            message: 'User not found'
          }
        }));
      }

      if (!Auth.comparePassword(user.password, password)) {
        return res.status(200).send(CustomResponse({
          success: false,
          error: {
            code: 'auth/incorrect-credentials',
            message: 'The credentials you provided is incorrect'
          }
        }));
      }

      const token = Auth.generateToken(user.id);

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
      const user = await Auth.getUserByToken(token);

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

  static async usernameAvailability(req: Request, res: Response) {
    const { username } = req.body;

    if (!username) return res.status(400).send(CustomResponse({
      success: false,
      error: {
        code: 'auth/bad-body',
        message: 'Enter the username'
      }
    }));

    try {
      const user = await User.findOne({
        where: { username: username.toLocaleLowerCase() }
      });

      return res.status(200).send(!user);
    } catch(error) {
      return res.status(400).send(CustomResponse({ success: false, error }));
    }
  }

  static async emailAvailability(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) return res.status(400).send(CustomResponse({
      success: false,
      error: {
        code: 'auth/bad-body',
        message: 'Enter the email'
      }
    }));

    try {
      const user = await User.findOne({ where: { email } });

      return res.status(200).send(!user);
    } catch(error) {
      return res.status(400).send(CustomResponse({ success: false, error }));
    }
  }
}
