import { gql } from "graphql_tag";

export const typeDefs = gql`
  type Slot {
    id: ID!
    day: Int!
    month: Int!
    year: Int!
    hour: Int!
    available: Boolean!
    dni: String!
    doctorId: String!
    updatedBy: User!
  }
  type Doctor {
    id: ID!
    name: String!
    lastname: String!
    age: Int!
    specialty: String!
    updatedBy: User!
  }
  type User {
    id: ID!
    mail: String!
    password: String!
    token: String!
  }
  type Query {
    doctors(specialty: String): [Doctor!]!
    doctor(id: ID!): Doctor!
    slots(available: Boolean): [Slot!]!
    slotsDni(dni: String!): [Slot!]!
    slotsId(id: ID): Slot!
  }
  type Mutation {
    createUser(mail: String!, password: String!): User!
    login(mail: String!, password: String!): User!
    createDoctor(name: String!, lastname: String!, age: Int!, specialty: String!, token: String!): Doctor!
    deleteDoctor(id: ID!, token: String!): Doctor!
    createSlot(day: Int!, month: Int!, year: Int!, hour: Int!, dni: String!, doctorId: String!, token: String!): Slot!
    updateSlot(id: ID!, day: Int!, month: Int!, year: Int!, hour: Int!, dni: String!, doctorId: String!, token: String!): Slot!
    bookSlot(id: ID!, dni: String!, doctorId: String!, token: String!): Slot!
    deleteSlot(id: ID!, token: String!): Slot!
  }
`;