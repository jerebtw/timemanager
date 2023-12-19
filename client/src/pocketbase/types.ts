import { BaseModel } from "pocketbase";

type Record = BaseModel & {
  updatedBy: string;
  createdBy: string;
};

export type BookingType = Record & {
  text: string;
  type: "+" | "-" | "";
  icon: string;
  updatedBy: string;
  createdBy: string;
};

export type Booking = Record & {
  type: string;
  timestamp: Date;
};

export type BookingYear = Record & {
  user: string;
  year: number;
  weeks: number[];
};
