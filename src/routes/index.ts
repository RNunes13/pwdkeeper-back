
import { Application } from "express";
import { UsersController, AuthController } from "../controllers";

export class Routes {
  private BASE = '/api';

  public routes(app: Application): void {
    app.get(this.BASE, (_, res) => res.status(200).send({
      success: true,
      message: 'Welcome to the PasswordKeeper API!',
    }));

    // Auth
    app.route(`${this.BASE}/sign-in`).post(AuthController.login);
    app.route(`${this.BASE}/sign-up`).post(UsersController.create);
    app.route(`${this.BASE}/auth-token`).get(AuthController.findUserByToken);
    app.route(`${this.BASE}/email-availability`).post(AuthController.emailAvailability);
    app.route(`${this.BASE}/username-availability`).post(AuthController.usernameAvailability);
    
    // Users
    app.route(`${this.BASE}/users`)
      .get(AuthController.verifyToken, UsersController.index)
      .post(UsersController.create);
    
    app.route(`${this.BASE}/users/:id`)
      .get(AuthController.verifyToken, UsersController.findById)
      .put(AuthController.verifyToken, UsersController.update)
      .delete(AuthController.verifyToken, UsersController.delete);
  }
}
