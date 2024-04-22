import express from 'express';
import Hello from './Hello.js';
import Lab5 from './Lab5.js';
import cors from "cors";
import CourseRoutes from './Kanbas/courses/routes.js';
import ModuleRoutes from "./Kanbas/modules/routes.js";
import AssignmentRoutes from './Kanbas/assignments/routes.js';
import QuizRoutes from './Kanbas/quiz/routes.js';
import mongoose from "mongoose";
import UserRoutes from "./Kanbas/Users/routes.js";

const app = express();
const CONNECTION_STRING = process.env.DB_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/kanbas'
mongoose.connect(CONNECTION_STRING);
    // Set up middleware
    app.use(cors());
    app.use(express.json());

    // Set up routes
    CourseRoutes(app);
    UserRoutes(app);
    ModuleRoutes(app);
    AssignmentRoutes(app);
    QuizRoutes(app)
    Lab5(app);
    Hello(app);

    // Start the server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
