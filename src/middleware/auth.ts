/* eslint-disable indent */
/* eslint-disable object-curly-spacing */
import * as admin from "firebase-admin";

const getAuthToken = (req: any, res: any, next: any) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
        req.authToken = req.headers.authorization.split(" ")[1];
    } else {
        req.authToken = null;
    }
    next();
};


export const checkIfAuthenticated = (req: any, res: any, next: any) => {
    getAuthToken(req, res, async () => {
        try {
            const { authToken } = req;
            if (req.get('host').startsWith('localhost') && authToken === 'postman-test-token') {
                // authToken = 'postman-test-token' only valid for localhost requests
                return next();
            }
            if (authToken == null) {
                return res
                    .status(401)
                    .send({ error: "Unauthorized" });
            }
            const userInfo = await admin
                .auth()
                .verifyIdToken(authToken);
            req.authId = userInfo.uid;
            return next();
        } catch (e) {
            return res
                .status(401)
                .send({ error: "Unauthorized" });
        }
    });
};
