import { ObjectId } from "mongo";
import * as bcrypt from "bcrypt";
import { UserCollection, doctorsCollection, slotsCollection } from "../db/db.ts";
import { DoctorSchema, SlotSchema, UserSchema } from "../db/schemas.ts";
import { createJWT, verifyJWT } from "../lib/jwt.ts";
import { User } from "../types.ts";

export const Mutation = {
    createUser: async (
        _: unknown,
        args: { mail: string; password: string }
      ): Promise<UserSchema> => {
        try {
          const { mail, password } = args;
          const exists = await UserCollection.findOne({
            mail,
          });
          if (exists) {
            throw new Error("User already exists");
          }
          const hashedPassword = await bcrypt.hash(args.password);
    
          const _id = await UserCollection.insertOne({
            mail,
            password: hashedPassword,
          });
          return {
            _id,
            mail,
            password,
          };
        } catch (e) {
          throw new Error(e);
        }
      },
      login: async (
        _: unknown,
        args: { mail: string; password: string }
      ): Promise<Omit<User, "password">> => {
        try {
          const { mail, password } = args;
          const user = await UserCollection.findOne({
            mail,
          });
          console.log(user);
          if (!user) {
            throw new Error("Invalid credentials");
          }
    
          const valid = await bcrypt.compare(password, user.password);
          if (!valid) {
            throw new Error("Invalid credentials");
          }
          const token = await createJWT(
            { mail, id: user._id.toString() },
            Deno.env.get("JWT_SECRET") || ""
          );
          return {
            token,
            id: user._id.toString(),
            mail: user.mail,
          };
        } catch (e) {
          throw new Error(e);
        }
      },
  createDoctor: async (
    _: unknown,
    args: { name: string; lastname: string; age: number; specialty: string; token: string}
  ): Promise<DoctorSchema> => {
    try {
      const { name, lastname, age, specialty, token } = args;
      const user: UserSchema = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET") || ""
      )) as UserSchema;
      if (!user) {
        throw new Error("Invalid token");
      }

      const exists = await doctorsCollection.findOne({
        name,
        lastname,
      });
      if (exists) {
        throw new Error("Doctor already exists");
      }

      const _id = await doctorsCollection.insertOne({
        name,
        lastname,
        age,
        specialty,
        updatedBy: user._id,
      });
      return {
        _id,
        name,
        lastname,
        age,
        specialty,
        updatedBy: user._id,
      };
    } catch (e) {
      throw new Error(e);
    }
  },
  deleteDoctor: async (_: unknown, args: { id: string; token: string }): Promise<DoctorSchema> => {
    try {
      const { id, token } = args;
      const user: UserSchema = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET") || ""
      )) as UserSchema;
      if (!user) {
        throw new Error("Invalid token");
      }
      const _id = new ObjectId(id);
      const doctor = await doctorsCollection.findOne({
        _id,
      });
      if (!doctor) {
        throw new Error("Doctor not found");
      }
      await slotsCollection.deleteMany({ doctorId: id });

      await doctorsCollection.deleteOne({ _id });
      return doctor;
    } catch (e) {
      throw new Error(e);
    }
  },

  createSlot: async (
    _: unknown,
    args: {
        day: number;
        month: number;
        year: number;
        hour: number;
        dni: string;
        doctorId: string;
        token: string;
    }
  ): Promise<SlotSchema> => {
    try {
      const { day, month, year, hour, dni, doctorId, token } = args;
      const user: UserSchema = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET") || ""
      )) as UserSchema;
      if (!user) {
        throw new Error("Invalid token");
      }
      const exists = await slotsCollection.findOne({
        day,
        month,
        year,
        hour,
        doctorId,
      });
      if (exists) {
        throw new Error("Slot already exists");
      }

      const _id = await slotsCollection.insertOne({
        day,
        month,
        year,
        hour,
        dni,
        doctorId,
        available: true,
        updatedBy: user._id,
      });
      return {
        _id,
        day,
        month,
        year,
        hour,
        dni,
        doctorId,
        available: true,
        updatedBy: user._id,
      };
    } catch (e) {
      throw new Error(e);
    }
  },
  updateSlot: async (
    _: unknown,
    args: {
        id: string;
        day: number;
        month: number;
        year: number;
        hour: number;
        dni: string;
        doctorId: string;
        token: string;
    }
  ): Promise<SlotSchema> => {
    try {
      const { id, day, month, year, hour, dni, doctorId, token } = args;
      const user: UserSchema = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET") || ""
      )) as UserSchema;
      if (!user) {
        throw new Error("Invalid token");
      }
      const _id = new ObjectId(id);
      const slot = await slotsCollection.updateOne(
        {
          _id,
        },
        {
          $set: {
            day,
        month,
        year,
        hour,
        dni,
        doctorId,
        updatedBy: user._id,
          },
        }
      );
      if (slot.matchedCount === 0) {
        throw new Error("Slot not found");
      }
      return (await slotsCollection.findOne({
        _id,
      })) as SlotSchema;
    } catch (e) {
      throw new Error(e);
    }
  },
  bookSlot: async (
    _: unknown,
    args: {
      id: string;
      dni: string;
      doctorId: string;
      token: string;
    }
  ): Promise<SlotSchema> => {
    try {
      const { id, dni, doctorId, token } = args;
      const user: UserSchema = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET") || ""
      )) as UserSchema;
      if (!user) {
        throw new Error("Invalid token");
      }
      const _id = new ObjectId(id);
      const slot = await slotsCollection.findOne({ _id });
  
      if (!slot) {
        throw new Error("Slot not found");
      }
  
      if (!slot.available) {
        throw new Error("Slot already booked");
      }
  
      const updated = await slotsCollection.updateOne(
        { _id },
        {
          $set: {
            dni,
            doctorId,
            available: false,
            updatedBy: user._id,
          },
        }
      );
  
      if (!updated) {
        throw new Error("Slot not found");
      }
  
      return (await slotsCollection.findOne({ _id })) as SlotSchema;
    } catch (e) {
      throw new Error(e);
    }
  },
  deleteSlot: async (
    _: unknown,
    args: { id: string, token: string }
  ): Promise<SlotSchema> => {
    try {
      const { id, token } = args;
      const _id = new ObjectId(id);
      const user: UserSchema = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET") || ""
      )) as UserSchema;
      if (!user) {
        throw new Error("Invalid token");
      }
      const slot = await slotsCollection.findOne({
        _id,
      });
      if (!slot) {
        throw new Error("Slot not found");
      }
      await slotsCollection.deleteOne({ _id });
      return slot;
    } catch (e) {
      throw new Error(e);
    }
  },
}