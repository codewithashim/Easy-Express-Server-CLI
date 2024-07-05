import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { ExampleController } from "./example.controller";
import { createExampleValidator } from "./example.validation";

const router = express.Router();

router.post(
  "/",
  validateRequest(createExampleValidator.createExampleZodSchema),
  ExampleController.createExample
);

router.get("/", ExampleController.getAllExamples);

router.get("/:id", ExampleController.getExampleById);

router.patch(
  "/:id",
  validateRequest(createExampleValidator.updateExampleZodSchema),
  ExampleController.updateExample
);

router.delete("/:id", ExampleController.deleteExample);

export const ExampleRoutes = router;
