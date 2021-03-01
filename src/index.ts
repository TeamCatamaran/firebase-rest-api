import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import { checkIfAuthenticated } from "./middleware/auth";

const app = express();
app.use(cors({ origin: true }));

const serviceAccount = require("./account.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const unless = (middleware: any, ...paths: string[]) => {
    return (req: any, res: any, next: any) => {
        const pathCheck = paths.some((path) => path === req.path);
        pathCheck ? next() : middleware(req, res, next);
    };
};

// Add express middleware
app.use(unless(checkIfAuthenticated, "/user/login"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add default API routes
import * as defaultRoutes from "./routes/defaultRoutes";
defaultRoutes.addRoutes(app, db);

exports.api = functions
    .https
    .onRequest(app);
