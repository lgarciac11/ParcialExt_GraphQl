import { doctorsCollection, UserCollection } from "../db/db.ts";
import { DoctorSchema, UserSchema } from "../db/schemas.ts";

export const Doctor = {
  id: (parent: DoctorSchema): string => parent._id.toString(),
  updatedBy: async (parent: DoctorSchema): Promise<UserSchema> => {
    try {
      const user = await UserCollection.findOne({ _id: parent.updatedBy });
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (e) {
      throw new Error(e);
    }
  }
};