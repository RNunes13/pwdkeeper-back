
import * as fs from 'fs';
import * as path from 'path';
import { Sequelize } from "sequelize";

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/sequelize.js')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db: {[key: string]: any} = {
  sequelize,
  Sequelize,
};

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) db[modelName].associate(db);
});

export default db;
