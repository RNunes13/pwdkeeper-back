
import jwt from 'jsonwebtoken';
import { AuthController } from './index';
import { Request, Response } from "express";
import { UpdateOptions, DestroyOptions } from 'sequelize';
import { User, UserInterface } from "../models/user.model";

const MAX_AGE_COOKIE = 604800000; // In milliseconds -> 7d
export class UsersController {
  public index(req: Request, res: Response) {
    User
      .scope('withoutPassword')
      .findAll<User>({})
      .then((users: Array<User>) => res.json(users))
      .catch((err: Error) => res.status(500).json(err));
  }

  public create(req: Request, res: Response) {
    const params: UserInterface = req.body;

    const hashPassword = AuthController.hashPassword(params.password);

    User
      .scope('withoutPassword')
      .create<User>({
        ...params,
        password: hashPassword,
        username: params.username.toLocaleLowerCase(),
      })
      .then((user: User) => {
        (user.password as any) = undefined;

        const JWT_SECRET = process.env.JWT_SECRET as string;
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: MAX_AGE_COOKIE / 1000 });

        res.status(201).json({
          token,
          ...user.toJSON(),
        });
      })
      .catch((err: Error) => res.status(500).json(err));
  }

  public findById(req: Request, res: Response) {
    User.findByPk<User>(req.params.id)
      .then((user: User | null) => {
        if (user) res.json(user);
        else res.status(404).json({ errors: ["User not found"] });
      })
      .catch((err: Error) => res.status(500).json(err));
  }

  public update(req: Request, res: Response) {
    const id = req.params.id;
    const params: UserInterface = req.body;

    const update: UpdateOptions = {
      where: { id },
      limit: 1
    };

    User.update(params, update)
      .then(() => res.status(202).json({ data: "success" }))
      .catch((err: Error) => res.status(500).json(err));
  }

  public delete(req: Request, res: Response) {
    const id = req.params.id;
    const options: DestroyOptions = {
      where: { id },
      limit: 1
    };

    User.destroy(options)
      .then(() => res.status(200).json({ data: "success" }))
      .catch((err: Error) => res.status(500).json(err));
  }
}
