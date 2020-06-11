
import { Application } from "express";
import { UsersController } from "../controllers";

export class Routes {
  public usersController: UsersController = new UsersController();
  private BASE = '/api';

  public routes(app: Application): void {
    app.get(this.BASE, (_, res) => res.status(200).send({
      success: true,
      message: 'Welcome to the PasswordKeeper API!',
    }));

    // Users
    app.route(`${this.BASE}/users`)
      .get(this.usersController.index)
      .post(this.usersController.create);

    app.route(`${this.BASE}/users/:id`)
      .get(this.usersController.findById)
      .put(this.usersController.update)
      .delete(this.usersController.delete);
  }
}
