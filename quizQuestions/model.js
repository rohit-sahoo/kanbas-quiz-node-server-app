import mongoose from "mongoose";
import { quizQuestionSchema } from "./schema.js";

export const quizQuestionsModel = mongoose.model(
  "QuizQuestionsModel",
  quizQuestionSchema
);
