import { ObjectId } from "mongo";
import { doctorsCollection} from "../db/db.ts";
import {slotsCollection} from "../db/db.ts";
import { DoctorSchema } from "../db/schemas.ts";
import { SlotSchema } from "../db/schemas.ts";


export const Query = {
    doctors: async (
      _: unknown,
      args: { specialty?: string }
    ): Promise<DoctorSchema[]> => {
      try {
        if (args.specialty !== undefined) {
          return await doctorsCollection.find({ specialty: args.specialty}).toArray();
        }
  
        const doctors = doctorsCollection.find({
        }).toArray();
        return doctors;
      } catch (e) {
        throw new Error(e);
      }
    },
    doctor: async (_: unknown, args: { id: string }): Promise<DoctorSchema> => {
      try {
        const doctor = await doctorsCollection.findOne({ _id: new ObjectId(args.id) });
        if (!doctor) {
          throw new Error("Doctor not found");
        }
        return doctor;
      } catch (e) {
        throw new Error(e);
      }
    },
    slots: async (
      _: unknown,
      args: { available?: boolean}
    ): Promise<SlotSchema[]> => {
      try {
        if (args.available !== undefined) {
            return await slotsCollection.find({available: args.available}).toArray();
          }
          const slots = await slotsCollection.find({
        }).toArray();
        return slots;
        }
       catch (e) {
        throw new Error(e);
      }
    },
    //Se puede quitar el '?' y entonces podriamos omitir la parte de Missing DNI.
    slotsDni: async ( _: unknown, args: { dni: string } ): Promise<SlotSchema[]> => {
        try {
            const slot = await slotsCollection.find({dni: args.dni}).toArray();
            return slot;
          }
         catch (e) {
          throw new Error(e);
        }
    },
    slotsId: async (_: unknown, args: { id: string }): Promise<SlotSchema> => {
        try {
          const slot = await slotsCollection.findOne({ _id: new ObjectId(args.id) });
          if (!slot) {
            throw new Error("Slot not found");
          }
          return slot;
        } catch (e) {
          throw new Error(e);
        }
      },
  };