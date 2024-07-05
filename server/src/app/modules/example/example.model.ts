import { Schema, model } from "mongoose";
import { IExample, ExampleModel } from "./example.interface";

const ExampleSchema = new Schema<IExample>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Example = model<IExample, ExampleModel>("Example", ExampleSchema);
