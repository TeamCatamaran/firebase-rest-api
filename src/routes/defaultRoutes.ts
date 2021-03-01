/* eslint-disable max-len */
import { Express } from "express";

export const addRoutes = (app: Express, db: FirebaseFirestore.Firestore) => {
    // create
    app.post("/:collection_name", (req, res) => {
        (async () => {
            const collectionName = req.params.collection_name;
            if (collectionName == null) {
                return res.status(400).send();
            }
            const itemRef = db.collection(collectionName).doc();

            try {
                const document = db.collection(collectionName).doc(itemRef.id);
                await document.create(req.body);
                const item = await document.get();
                const data = item.data() || {};
                data.id = item.id;
                res.setHeader("Location", `/api/${collectionName}/${item.id}`);
                return res.status(201).send(data);
            } catch (error) {
                console.error(error);
                return res.status(500).send(error);
            }
        })()
            .catch((err) => {
                console.error(err);
                return res.status(500).send(err);
            });
    });

    // delete
    app.delete("/:collection_name/:item_id", (req, res) => {
        (async () => {
            const collectionName = req.params.collection_name;
            if (collectionName == null) {
                return res.status(400).send();
            }
            const itemId = req.params.item_id;
            if (itemId == null) {
                return res.status(400).send();
            }

            try {
                const document = db.collection(collectionName).doc(itemId);
                await document.delete();
                return res.status(204).send();
            } catch (error) {
                console.log(error);
                return res.status(500).send(error);
            }
        })()
            .catch((err) => {
                console.error(err);
                return res.status(500).send(err);
            });
    });

    // get item
    app.get("/:collection_name/:item_id", (req, res) => {
        (async () => {
            const collectionName = req.params.collection_name;
            if (collectionName == null) {
                return res.status(400).send();
            }
            const itemId = req.params.item_id;
            console.log(itemId);
            if (itemId == null) {
                return res.status(400).send();
            }

            try {
                const document = db.collection(collectionName).doc(itemId);
                const item = await document.get();
                const data = item.data();
                if (data == null) {
                    return res.status(404).send();
                }
                data.id = item.id;
                return res.status(200).send(data);
            } catch (error) {
                console.log(error);
                return res.status(500).send(error);
            }
        })()
            .catch((err) => {
                console.error(err);
                return res.status(500).send(err);
            });
    });

    // get all
    app.get("/:collection_name", (req, res) => {
        (async () => {
            const collectionName = req.params.collection_name;
            if (collectionName == null) {
                return res.status(400).send();
            }

            try {
                const query = db.collection(collectionName);
                const response: any[] = [];
                await query.get().then((snapshot) => {
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
        })()
            .catch((err) => {
                console.error(err);
                return res.status(500).send(err);
            });
    });

    // update
    app.put("/:collection_name/:item_id", (req, res) => {
        (async () => {
            const collectionName = req.params.collection_name;
            if (collectionName == null) {
                return res.status(400).send();
            }
            const itemId = req.params.item_id;
            if (itemId == null) {
                return res.status(400).send();
            }

            try {
                await db.collection(collectionName).doc(itemId)
                    .set(req.body);
                return res.status(200).send();
            } catch (error) {
                console.error(error);
                return res.status(500).send(error);
            }
        })()
            .catch((err) => {
                console.error(err);
                return res.status(500).send(err);
            });
    });
};