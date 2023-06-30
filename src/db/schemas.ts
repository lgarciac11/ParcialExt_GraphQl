import { ObjectId } from "mongo";
import { Doctor, Slot, User} from "../types.ts";

export type SlotSchema = Omit<Slot, "id" | "updatedBy"> & {
  _id: ObjectId;
  updatedBy: ObjectId;
};

export type DoctorSchema = Omit<Doctor, "id" | "updatedBy"> & {
  _id: ObjectId;
  updatedBy: ObjectId;
}
export type UserSchema = Omit<User, "id" | "token"> & {
    _id: ObjectId;
  };