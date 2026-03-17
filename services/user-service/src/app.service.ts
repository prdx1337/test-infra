import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createUser(userId: string, email: string, name: string) {
    const user = new this.userModel({ userId, email, name });
    return user.save();
  }
}
