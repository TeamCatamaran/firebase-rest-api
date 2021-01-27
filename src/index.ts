import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';

const app = express();
app.use(cors({ origin: true }));

const serviceAccount = require('./account.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// create
app.post('/api/:collection_name', (req, res) => {
    (async () => {
        const collectionName = req.params.collection_name;
        if (collectionName == null) {
            return res.status(400);
        }
        const itemRef = db.collection(collectionName).doc();

        try {
            const document = db.collection(collectionName).doc(itemRef.id);
            await document.create(req.body);
            const item = await document.get();
            const data = item.data() || {};
            data.id = item.id;
            res.setHeader('Location', `/api/${collectionName}/${item.id}`);
            return res.status(201).send(data);
        } catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    })();
});

// delete
app.delete('/api/:collection_name/:item_id', (req, res) => {
    (async () => {
        const collectionName = req.params.collection_name;
        if (collectionName == null) {
            return res.status(400);
        }
        const itemId = req.params.item_id;
        if (itemId == null) {
            return res.status(400);
        }

        try {
            const document = db.collection(collectionName).doc(itemId);
            await document.delete();
            return res.status(204).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

// get item
app.get('/api/:collection_name/:item_id', (req, res) => {
    (async () => {
        const collectionName = req.params.collection_name;
        if (collectionName == null) {
            return res.status(400);
        }
        const itemId = req.params.item_id;
        if (itemId == null) {
            return res.status(400);
        }

        try {
            const document = db.collection(collectionName).doc(itemId);
            const item = await document.get();
            const data = item.data() || {};
            data.id = item.id;
            return res.status(200).send(data);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

// get all
app.get('/api/:collection_name', (req, res) => {
    (async () => {
        const collectionName = req.params.collection_name;
        if (collectionName == null) {
            return res.status(400);
        }

        try {
            let query = db.collection(collectionName);
            let response: any[] = [];
            await query.get().then(snapshot => {
                snapshot.forEach((doc) => {
                    const item = doc.data();
                    item.id = doc.id;
                    response.push(item);
                });
            });
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

// update
app.put('/api/:collection_name/:item_id', (req, res) => {
    (async () => {
        const collectionName = req.params.collection_name;
        if (collectionName == null) {
            return res.status(400);
        }
        const itemId = req.params.item_id;
        if (itemId == null) {
            return res.status(400);
        }

        console.log(req.body);

        try {
            await db.collection(collectionName).doc(itemId)
                .set(req.body);
            return res.status(201).send(itemId);
        } catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    })();
});

exports.app = functions.https.onRequest(app);
