import express from "express";
import startEnv from "./startup/env";
import startProd from "./startup/prod";
import startLogging from "./startup/logging";
import startError from "./startup/error";
import startDb from "./startup/db";
import startRoutes from "./startup/routes";
import startPrivateKey from "./startup/privateKey";
// import fs from "fs";
// import https from "https";

const app = express();
// const key = fs.readFileSync("private.key");
// const certificate = fs.readFileSync("certificate.crt");
// const credentials = { key, certificate };
// const httpsServer = https.createServer(credentials, app);

startEnv();
startProd(app);
startError();
startLogging();
startDb();
startRoutes(app);
startPrivateKey();

const port = process.env.PORT || 3000;
// const httpsPort = 3001;

app.listen(port, () => console.info(`Listening on port ${port}`));
// httpsServer.listen(httpsPort);

export default app;
