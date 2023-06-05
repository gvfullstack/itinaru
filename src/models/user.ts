import { Schema, model, models } from 'mongoose';
const _ = require('lodash');

interface IUser {
  displayName: string;
  email: string;
}

const mongoSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: String
});


const User = models.User || model<IUser>('User', mongoSchema);

export default User;