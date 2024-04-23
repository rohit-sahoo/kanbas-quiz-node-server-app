import mongoose from "mongoose";
import quizSchema from "./schema.js";

export const quizzesModel = mongoose.model("QuizzesModel", quizSchema);
