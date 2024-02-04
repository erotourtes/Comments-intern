import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = parseInt(process.env.SALT_ROUNDS);
  if (isNaN(saltRounds)) throw new Error('Invalid salt rounds');

  const hashed = await bcrypt.hash(password, saltRounds);
  return hashed;
};

// export const generateSalt = async () => {
//   const saltRounds = parseInt(process.env.SALT_ROUNDS);
//   if (isNaN(saltRounds)) throw new Error('Invalid salt rounds');

//   return await bcrypt.genSalt(saltRounds);
// };

export const comparePassword = async (plain: string, hashed: string) => {
  return await bcrypt.compare(plain, hashed);
};
