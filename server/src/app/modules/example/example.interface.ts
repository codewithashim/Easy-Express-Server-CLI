import { Model } from "mongoose";

export type IExample = {
  title: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ExampleModel =Model<IExample, Record<string, unknown>>;
