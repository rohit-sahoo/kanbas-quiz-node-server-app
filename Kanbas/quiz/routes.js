import db from "../Database/index.js";

export default function AssignmentRoutes(app) {
    app.get("/api/courses/:cid/quizzes", (req, res) => {
        const { cid } = req.params;
        const quizzes = db.quizzes
            .filter((a) => a.course === cid);
        res.send(quizzes);
    });

    app.post("/api/courses/:cid/quizzes", (req, res) => {
        const { cid } = req.params;
        const newAssignment = {
            ...req.body,
            course: cid,
            _id: new Date().getTime().toString(),
        };
        db.quizzes.push(newAssignment);
        res.send(newAssignment);
    });

    app.delete("/api/quizzes/:aid", (req, res) => {
        const { aid } = req.params;
        db.quizzes = db.quizzes
            .filter((a) => a._id !== aid);
        res.sendStatus(200);
    });

    app.put("/api/quizzes/:aid", (req, res) => {
        const { aid } = req.params;
        const quizIndex = db.quizzes
            .findIndex((a) => a._id === aid);
        db.quizzes[quizIndex] = {
            ...db.quizzes[quizIndex],
            ...req.body
        };
        //res.sendStatus(204);
        res.send(db.quizzes[quizIndex])
    });
}
