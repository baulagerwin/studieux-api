import express from "express";
import startEnv from "./startup/env";
import startProd from "./startup/prod";
import startLogging from "./startup/logging";
import startError from "./startup/error";
import startDb from "./startup/db";
import startRoutes from "./startup/routes";
import startPrivateKey from "./startup/privateKey";

const app = express();

startEnv();
startProd(app);
startError();
startLogging();
startDb();
startRoutes(app);
startPrivateKey();

const port = process.env.PORT || 3000;

app.listen(port, () => console.info(`Listening on port ${port}`));

export default app;
