
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

export class Auth {
  static getUserByToken(token: string): Promise<User | null> {
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
    const token = jwt.sign({ userId: id }, JWT_SECRET, { expiresIn: parseInt(process.env.MAX_AGE_TOKEN as string) / 1000 });

    return token;
  }
}
