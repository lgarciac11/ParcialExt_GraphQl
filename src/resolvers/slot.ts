import { slotsCollection, UserCollection } from "../db/db.ts";
import { SlotSchema, UserSchema } from "../db/schemas.ts";

export const Slot = {
  id: (parent: SlotSchema): string => parent._id.toString(),
  updatedBy: async (parent: SlotSchema): Promise<UserSchema> => {
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