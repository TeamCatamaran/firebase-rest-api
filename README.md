# firebase-rest-api boilerplate

This repository is a boilerplate typescript firebase function project that adds a rest API for firestore.

In order to create an app with Firebase please access the [Firebase Console](https://console.firebase.google.com/).

In order to learn about the Firebase Admin SDK please access [Firebase Documentation](https://firebase.google.com/docs/reference/admin).

This project is a boilerplate of the `functions` folder for the API endpoints.

The `postman_collection.json` file is a postman collection that has example calls that you can run. It is available for import here: https://raw.githubusercontent.com/phess101/firebase-rest-api/main/postman_collection.json
- Folder `localhost` are calls when running the functions locally
- Folder `deployed` are calls when running the functions deployed.
- Collection uses the following environment variables for local testing: `project-id`, `project-region`, `item-id`. Production environment will need a valid authorization bearer token that can be generated from the [firebase SDK](https://firebase.google.com/docs/auth). Please review the Postman documentation for more info on [how to set this up here](https://blog.getpostman.com/2014/02/20/using-variables-inside-postman-and-collection-runner/).

## Setup
- Create a service account in your firebase project. Copy the private key into the functions/lib folder, and name the file `account.json`
- Enable [firebase authentication](https://firebase.google.com/docs/auth)
- Edit the `unless` function parameters in index.ts for all routes that unauthenticated users can access. For example, `app.use(unless(checkIfAuthenticated, "/user/login"));` allows unauthenticated access only to the `/api/user/login` route. Remove this line entirely if not using authentication.
- Add any additional API routes below the default routes in `index.ts`
- Configure the function with your region (if different from us-central1) and any allocation requirements. For example

```
functions
.runWith({ memory: "1GB" })
.region("us-east4")
```

Will run your function in us-east4 with 1GB memory. Full configuration can be found at the [Firebase deployment and runtime options](https://firebase.google.com/docs/functions/manage-functions)

## How to use

To run the project, execute the following

`npm run serve`

To refresh the server when the code changes, open an additional terminal and run

`npm run watch`

To deploy the project to your firebase functions, execute the following

`npm run deploy`

## Resources

Much of the code in this project is based on [how to build a firebase api](https://github.com/andrewevans0102/how-to-build-a-firebase-api)