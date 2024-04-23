import { quizQuestionsModel } from "./model.js";

export const getQuizQuestionsByQuizId = (quizId) =>
  quizQuestionsModel.find({ quizId: quizId });

export const createQuizQuestion = async (quizId, quizQuestion) => {
  delete quizQuestion._id;
  quizQuestion.quizId = quizId;
  return await quizQuestionsModel.create(quizQuestion);
};

export const deleteQuizQuestion = async (quizQuestionId) => {
  return await quizQuestionsModel.findByIdAndDelete(quizQuestionId);
};

export const updateQuizQuestion = async (quizQuestionId, quizQuestion) => {
  return await quizQuestionsModel.findByIdAndUpdate(
    quizQuestionId,
    quizQuestion
  );
};

export const getQuizQuestion = (quizQuestionId) =>
  quizQuestionsModel.findById(quizQuestionId);
