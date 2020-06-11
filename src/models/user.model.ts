
import { Model, DataTypes } from 'sequelize';
import Database from './index';

export interface UserInterface {
  name: string;
  username: string;
  email: string;
  password: string;
  disabled?: boolean
}

export class User extends Model {
  public id!: number;
  public name!: string;
  public username!: string;
  public email!: string;
  public password!: string;
  public disabled!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: new DataTypes.STRING(200),
      allowNull: false,
    },
    username: {
      type: new DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Please enter a valid email address'
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNotShort(value: string) {
          if (value !== null && value.length < 8) {
            throw new Error('Password should be at least 8 characters');
          }
        },
      },
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  },
  {
    tableName: "users",
    sequelize: Database.sequelize
  }
);

User.sync({ force: false }).then(() => console.log("User table created"));
