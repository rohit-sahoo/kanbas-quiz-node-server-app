import { Schema } from "mongoose";
import mongoose from "mongoose";

export const choiceSchema = new mongoose.Schema({
  choiceText: String,
  isCorrect: Boolean,
});

export const quizQuestionSchema = new mongoose.Schema(
  {
    quizId: { type: Schema.ObjectId, ref: "QuizzesModel" },
    quizQuestionType: Number,
    title: { type: String, required: true },
    questionText: String,
    points: Number,
    answerChoices: [choiceSchema],
    correctBooleanAnswer: Boolean,
    correctBlankAnswers: [String],
  },
  { collection: "quizQuestions" }
);

export default { choiceSchema, quizQuestionSchema };
