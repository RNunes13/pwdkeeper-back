
import { Request, Response } from "express";
import { UpdateOptions, DestroyOptions } from 'sequelize';
import { User, UserInterface } from "../models/user.model";

export class UsersController {
  public index(req: Request, res: Response) {
    User
      .findAll<User>({})
      .then((users: Array<User>) => res.json(users))
      .catch((err: Error) => res.status(500).json(err));
  }

  public create(req: Request, res: Response) {
    const params: UserInterface = req.body;

    User.create<User>(params)
      .then((user: User) => res.status(201).json(user))
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
