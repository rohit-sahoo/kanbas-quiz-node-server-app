import * as quizQuestionsDao from "./dao.js";
import * as quizzesDao from "./../quizzes/dao.js";

export default function QuizRoutes(app) {
  const findQuizQuestionsByQuizId = async (req, res) => {
    try {
      const { qid } = req.params;
      const quizQuestions = await quizQuestionsDao.getQuizQuestionsByQuizId(
        qid
      );
      if (!quizQuestions) {
        res.status(404).send("Quiz Questions not found");
        return;
      }
      res.send(quizQuestions);
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  const findQuizQuestion = async (req, res) => {
    try {
      const { qqid } = req.params;
      const quizQuestions = await quizQuestionsDao.getQuizQuestion(qqid);
      if (!quizQuestions) {
        res.status(404).send("Quiz not found");
        return;
      }
      res.send(quizQuestions);
    } catch (e) {
      console.log("Error: ", e);
    }
  };
  const createQuizQuestion = async (req, res) => {
    try {
      const { qid } = req.params;
      const quiz = await quizQuestionsDao.createQuizQuestion(qid, req.body);
      res.json(quiz);
    } catch (e) {
      console.log("Error: ", e);
    }
  };
  const deleteQuizQuestion = async (req, res) => {
    try {
      const { qqid } = req.params;
      const status = await quizQuestionsDao.deleteQuizQuestion(qqid);
      res.json(status);
    } catch (e) {
      console.log("Error: ", e);
    }
  };
  const updateQuizQuestion = async (req, res) => {
    try {
      const { qqid } = req.params;
      const status = await quizQuestionsDao.updateQuizQuestion(qqid, req.body);
      res.json(status);
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  const updateQuizQuestions = async (req, res) => {
    try {
      const { qid } = req.params;
      const newQuizQuestions = req.body;
      const oldQuizQuestions = await quizQuestionsDao.getQuizQuestionsByQuizId(
        qid
      );

      const promises = [];
      let totalPoints = 0;

      // create and update
      for (let i = 0; i < newQuizQuestions.length; i++) {
        let matchFound = false;

        for (let j = 0; j < oldQuizQuestions.length; j++) {
          if (newQuizQuestions[i]._id === oldQuizQuestions[j]._id.toString()) {
            // update
            matchFound = true;
            promises.push(
              await quizQuestionsDao.updateQuizQuestion(
                newQuizQuestions[i]._id,
                newQuizQuestions[i]
              )
            );

            totalPoints += newQuizQuestions[i].points;
            break;
          }
        }

        if (matchFound === false) {
          // create
          delete newQuizQuestions[i]._id;
          promises.push(
            await quizQuestionsDao.createQuizQuestion(
              newQuizQuestions[i].quizId,
              newQuizQuestions[i]
            )
          );
          totalPoints += newQuizQuestions[i].points;
        }
      }

      // delete
      for (let j = 0; j < oldQuizQuestions.length; j++) {
        let matchFound = false;
        for (let i = 0; i < newQuizQuestions.length; i++) {
          if (newQuizQuestions[i]._id === oldQuizQuestions[j]._id.toString()) {
            matchFound = true;
            break;
          }
        }

        if (matchFound === false) {
          // delete
          promises.push(
            await quizQuestionsDao.deleteQuizQuestion(
              oldQuizQuestions[j]._id.toString()
            )
          );
        }
      }

      promises.push(
        await quizzesDao.updateQuiz(qid, {
          $set: {
            questionsCount: newQuizQuestions.length,
            points: totalPoints,
          },
        })
      );

      await Promise.all(promises);
      res.json(204);
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  app.get("/api/quizzes/:qid/questions", findQuizQuestionsByQuizId);
  app.post("/api/quizzes/:qid/quizQuestion", createQuizQuestion);
  app.get("/api/quizQuestions/:qqid", findQuizQuestion);
  app.delete("/api/quizQuestions/:qqid", deleteQuizQuestion);
  app.put("/api/quizQuestions/:qqid", updateQuizQuestion);
  app.post("/api/quizzes/:qid/quizQuestions/bulkEdit", updateQuizQuestions);
}
