import { Schema } from "mongoose";
import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    courseId: { type: Schema.ObjectId, ref: "CoursesModel" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    quizType: Number,
    availableDate: Date,
    dueDate: Date,
    availableUntilDate: Date,
    points: Number,
    questionsCount: Number,
    isMultipleAvailableDates: Boolean,
    isPublished: Boolean,
    isShuffleAnswers: Boolean,
    timeLimit: Number,
    isMultipleAttempts: Boolean,
    showCorrectAnswersDate: Date,
    isOneQuestionAtATime: Boolean,
    isWebcamRequired: Boolean,
    isLockQuestionsAfterAnswering: Boolean,
  },
  { collection: "quizzes" }
);

export default quizSchema;
