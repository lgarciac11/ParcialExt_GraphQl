export type Slot = {
  id: string;
    day: number;
    month: number;
    year: number;
    hour: number;
    available: boolean;
    dni: string;
    doctorId: string;
    updatedBy: User;
  };
  
  export type Doctor = {
    id: string;
    name: string;
    lastname: string;
    age: number;
    specialty: string;
    updatedBy: User;
  }
  export type User = {
    id: string;
    mail: string;
    password: string;
    token: string;
  };