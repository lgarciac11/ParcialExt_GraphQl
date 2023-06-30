import { UserSchema } from "../db/schemas.ts";

export const User = {
  id: (user: UserSchema): string => user._id,
};