
import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { Routes } from '../routes';

class App {
  public app: express.Application;
  public routes: Routes = new Routes();

  constructor() {
    this.app = express();
    this.config();
    this.routes.routes(this.app);
  }

  private config(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(cookieParser());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }
}

export default new App().app;
