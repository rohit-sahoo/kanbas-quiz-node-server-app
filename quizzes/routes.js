import * as dao from "./dao.js";

export default function QuizRoutes(app) {
  const findAllQuizzesByCourseId = async (req, res) => {
    try {
      const { cid } = req.params;
      const quizzes = await dao.getAllQuizzesByCourseId(cid);
      if (!quizzes) {
        res.status(404).send("Quizzes not found");
        return;
      }
      res.send(quizzes);
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  const createQuiz = async (req, res) => {
    try {
      const { cid } = req.params;
      const quiz = await dao.createQuiz(cid, req.body);
      res.json(quiz);
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  const deleteQuiz = async (req, res) => {
    try {
      const { qid } = req.params;
      const status = await dao.deleteQuiz(qid);
      res.json(status);
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  const updateQuiz = async (req, res) => {
    try {
      const { qid } = req.params;
      const status = await dao.updateQuiz(qid, req.body);
      res.json(status);
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  const findQuizDetails = async (req, res) => {
    try {
      const { qid } = req.params;
      const quizDetails = await dao.getQuizDetails(qid);
      if (!quizDetails) {
        res.status(404).send("Quiz not found");
        return;
      }
      res.send(quizDetails);
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  const publishQuiz = async (req, res) => {
    try {
      const { qid } = req.params;
      const quizDetails = await dao.getQuizDetails(qid);
      if (!quizDetails) {
        res.status(404).send("Quiz not found");
        return;
      }

      const { isPublished } = req.body;
      quizDetails.isPublished = isPublished;
      await dao.updateQuiz(quizDetails._id, quizDetails);

      res.sendStatus(204);
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  app.get("/api/courses/:cid/quizzes", findAllQuizzesByCourseId);
  app.get("/api/quizzes/:qid", findQuizDetails);
  app.post("/api/courses/:cid/quizzes", createQuiz);
  app.delete("/api/quizzes/:qid", deleteQuiz);
  app.put("/api/quizzes/:qid", updateQuiz);
  app.post("/api/quizzes/:qid/publish", publishQuiz);
}
