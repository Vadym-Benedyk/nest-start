import crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

export const generateToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  return bcrypt.hash(token, 10);
}