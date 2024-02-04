export function exclude<User, Key extends keyof User>(
  user: User,
  keys: Key[],
): Omit<User, Key> {
  // @ts-ignore
  return Object.fromEntries(
    // @ts-ignore
    Object.entries(user).filter(([key]) => !keys.includes(key)),
  );
}

export function excludePassword<User>(
  user: User | null | undefined,
): Omit<User, 'password'> {
  if (!user) return;
  // @ts-ignore
  return exclude(user, ['password']);
}
