
import http from 'http';
import dotenv from 'dotenv';
import app from "./app";

/**
 * Webpack HMR Activation
 */
type ModuleId = string | number;

interface WebpackHotModule {
  hot?: {
    data: any;
    accept(
      dependencies: string[],
      callback?: (updatedDependencies: ModuleId[]) => void,
    ): void;
    accept(dependency: string, callback?: () => void): void;
    accept(errHandler?: (err: Error) => void): void;
    dispose(callback: (data: any) => void): void;
  };
}

declare const module: WebpackHotModule;

/**
 * Environments
 */
dotenv.config();

const HOST = process.env.HOST || 'localhost';
const PORT = parseInt((process.env.PORT || 3035) as string);

const server = http.createServer(app);

server.listen(PORT, HOST, () => console.log(`[server] app listening at http://${HOST}:${PORT}/`));

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => server.close());
}
