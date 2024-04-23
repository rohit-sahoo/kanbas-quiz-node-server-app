import db from "../Database/index.js"; // Assuming you have a similar JSON database setup

export default function QuizRoutes(app) {
    app.get("/api/courses/:cid/quizzes", (req, res) => {
        const { cid } = req.params;
        const quizzes = db.quizzes
            .filter(quiz => quiz.courseId === cid);
        res.send(quizzes);
    });

    app.post("/api/courses/:cid/quizzes", (req, res) => {
        const { cid } = req.params;
        const newQuiz = {
            ...req.body,
            courseId: cid,
            _id: new Date().getTime().toString(),  // Use a timestamp as a simple unique ID
        };
        db.quizzes.push(newQuiz);
        res.send(newQuiz);
    });

    app.delete("/api/quizzes/:qid", (req, res) => {
        const { qid } = req.params;
        const initialLength = db.quizzes.length;
        db.quizzes = db.quizzes
            .filter(quiz => quiz._id !== qid);
        const finalLength = db.quizzes.length;
        res.sendStatus(finalLength < initialLength ? 200 : 404);
    });

    app.put("/api/quizzes/:qid", (req, res) => {
        const { qid } = req.params;
        const quizIndex = db.quizzes
            .findIndex(quiz => quiz._id === qid);
        if (quizIndex === -1) {
            res.sendStatus(404);
            return;
        }
        db.quizzes[quizIndex] = {
            ...db.quizzes[quizIndex],
            ...req.body
        };
        res.send(db.quizzes[quizIndex]);
    });

    app.get("/api/quizzes/:qid", (req, res) => {
        const { qid } = req.params;
        const quiz = db.quizzes
            .find(quiz => quiz._id === qid);
        if (!quiz) {
            res.sendStatus(404);
            return;
        }
        res.send(quiz);
    });

    // Add this route for publishing a quiz
    app.post("/api/quizzes/:qid/publish", (req, res) => {
        try {
            const { qid } = req.params;
            const quiz = db.quizzes
            .find(quiz => quiz._id === qid);
            if (!quiz) {
              res.status(404).send("Quiz not found");
              return;
            }
      
            const { isPublished } = req.body;
            console.log("Is published is: ", isPublished)
            quiz.isPublished = isPublished;
            res.sendStatus(204); // Successfully processed the request and there is no content to return
        } catch (e) {
            console.log("Error: ", e);
          }

    });
}
