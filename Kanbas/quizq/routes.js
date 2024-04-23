import db from "../Database/index.js"; // Ensure you have quizQuestions in your JSON DB

export default function QuizQuestionRoutes(app) {
    app.get("/api/quizzes/:qid/questions", (req, res) => {
        //console.log("In QuizQuestionRoutes")
        const { qid } = req.params;
        // If IDs in db are numbers:
        const quizId = parseInt(qid, 10);
        const quizQuestions = db.quizQuestions.filter(qq => parseInt(qq.quizId, 10) === quizId);
    
        if (quizQuestions.length === 0) {
            quizQuestions = []
            res.send(quizQuestions);
            //res.sendStatus(404);
        } else {
            res.send(quizQuestions);
        }
    });

    app.get("/api/quizzes/:qid/quizQuestions", (req, res) => {
        console.log("In get")
        const { qid } = req.params; // Retrieve the quiz ID from the request parameters
    
        // Filter the quizQuestions array to find all questions associated with the given quiz ID
        const quizQuestions = db.quizQuestions.filter(question => question.quizId === qid);
    
        if (quizQuestions.length > 0) {
            res.send(quizQuestions); // Send the found quiz questions as the response
        } else {
            res.status(404).send("No questions found for this quiz"); // Send a 404 error if no questions are found
        }
    });
    

    app.post("/api/quizzes/:qid/quizQuestion", (req, res) => {
        console.log("Inside /api/quizzes/:qid/quizQuestion")
        const { qid } = req.params;
        const newQuizQuestion = {
            ...req.body,
            quizId: qid,
            _id: new Date().getTime().toString(), // Use a timestamp as a simple unique ID
        };
        db.quizQuestions.push(newQuizQuestion);
        res.send(newQuizQuestion);
    });

    app.get("/api/quizQuestions/:qqid", (req, res) => {
        const { qqid } = req.params;
        const quizQuestion = db.quizQuestions.find(qq => qq._id === qqid);
        if (!quizQuestion) {
            res.sendStatus(404);
        } else {
            res.send(quizQuestion);
        }
    });

    app.delete("/api/quizQuestions/:qqid", (req, res) => {
        const { qqid } = req.params;
        const initialLength = db.quizQuestions.length;
        db.quizQuestions = db.quizQuestions.filter(qq => qq._id !== qqid);
        const finalLength = db.quizQuestions.length;
        res.sendStatus(finalLength < initialLength ? 200 : 404);
    });

    app.put("/api/quizQuestions/:qqid", (req, res) => {
        const { qqid } = req.params;
        const questionIndex = db.quizQuestions.findIndex(qq => qq._id === qqid);
        if (questionIndex === -1) {
            res.sendStatus(404);
        } else {
            db.quizQuestions[questionIndex] = {
                ...db.quizQuestions[questionIndex],
                ...req.body
            };
            res.send(db.quizQuestions[questionIndex]);
        }
    });

    // app.post("/api/quizzes/:qid/quizQuestions/bulkEdit", (req, res) => {
    //     console.log("In backend inside bulkedit")
    //     const { qid } = req.params;
    //     const updates = req.body; // This should be an array of quiz question objects
    //     const existingQuestions = db.quizQuestions.filter(qq => qq.quizId === qid);
    //     const updatedQuestions = [];
    //     const newQuestions = updates.filter(u => !u.quizId);
    //     console.log("New questions are: ", newQuestions)

    //     // Update existing
    //     updates.forEach(update => {
    //         const index = existingQuestions.findIndex(eq => eq._id === update._id);
    //         if (index !== -1) {
    //             db.quizQuestions[db.quizQuestions.findIndex(qq => qq._id === update._id)] = {
    //                 ...existingQuestions[index],
    //                 ...update
    //             };
    //             updatedQuestions.push(db.quizQuestions[db.quizQuestions.findIndex(qq => qq._id === update._id)]);
    //         }
    //     });

    //     // Add new questions
    //     newQuestions.forEach(question => {
    //         const newQuestion = {
    //             ...question,
    //             quizId: qid,
    //             _id: new Date().getTime().toString(),
    //         };
    //         db.quizQuestions.push(newQuestion);
    //         updatedQuestions.push(newQuestion);
    //     });


    //     // Respond with updated list
    //     res.send(updatedQuestions);
    // });

    // app.post("/api/quizzes/:qid/quizQuestions/bulkEdit", (req, res) => {
    //     console.log("In backend inside bulkedit");
    //     const { qid } = req.params;
    //     const updates = req.body; // This should be an array of quiz question objects
    
    //     // Filter existing questions that are related to this quiz ID
    //     const existingQuestions = db.quizQuestions.filter(qq => qq.quizId === qid);
    //     const updatedQuestions = [];
    
    //     // Identify new questions by the absence of an '_id'
    //     const newQuestions = updates.filter(u => !u._id);
    //     console.log("New questions are: ", newQuestions);
    
    //     // Update existing questions
    //     updates.forEach(update => {
    //         const index = existingQuestions.findIndex(eq => eq._id === update._id);
    //         if (index !== -1) {
    //             // Found an existing question, update it
    //             db.quizQuestions[db.quizQuestions.findIndex(qq => qq._id === update._id)] = {
    //                 ...existingQuestions[index],
    //                 ...update
    //             };
    //             updatedQuestions.push(db.quizQuestions[db.quizQuestions.findIndex(qq => qq._id === update._id)]);
    //         }
    //     });
    
    //     // Add new questions to the database
    //     newQuestions.forEach(question => {
    //         const newQuestion = {
    //             ...question,
    //             quizId: qid,
    //             _id: new Date().getTime().toString(), // Assign a new unique ID
    //         };
    //         db.quizQuestions.push(newQuestion);
    //         updatedQuestions.push(newQuestion);
    //     });
    
    //     // Respond with updated list of questions
    //     res.send(updatedQuestions);
    // });

    app.post("/api/quizzes/:qid/quizQuestions/bulkEdit", (req, res) => {
        console.log("In backend inside bulkedit");
        const { qid } = req.params;
        const updates = req.body; // This should be an array of quiz question objects
        const updatedQuestions = [];
    
        // Iterate over each update request
        updates.forEach(update => {
            const index = db.quizQuestions.findIndex(qq => qq._id === update._id && qq.quizId === qid);
    
            if (index !== -1) {
                // Update existing question
                db.quizQuestions[index] = {
                    ...db.quizQuestions[index],
                    ...update
                };
                updatedQuestions.push(db.quizQuestions[index]);
            } else {
                // Add as a new question since it does not exist
                db.quizQuestions.push({
                    ...update,
                    quizId: qid,  // Ensure quizId is correctly associated
                    _id: new Date().getTime().toString(),  // Optionally assign a new _id if needed
                });
                updatedQuestions.push(update);
            }
        });
    
        // Respond with updated list of questions
        res.send(updatedQuestions);
    });
    
    
}
