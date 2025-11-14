// init sentry
import "@/utils/sentry";

import express from "express";
import {seeders, sequelize} from "@/models";
import config from '@/config/config'
import todosRouter from "@/routes/todos.routes";
import categoriesRouter from "@/routes/categories.routes";
import authRouter from "@/routes/auth.routes";
import {setupSwagger} from "@/swagger";
import {authenticate} from "@/middleware/auth.middleware";
import errorHandler from "@/middleware/error.handler";
import Sentry from "@sentry/node"

const app = express();
app.use(express.json());

app.use("/api/todos", todosRouter);
app.use("/api/categories", [authenticate], categoriesRouter);
app.use("/api/auth", authRouter)

Sentry.setupExpressErrorHandler(app);

app.use(errorHandler)

setupSwagger(app);

sequelize.sync({ alter: true }).then(async () => {
    await seeders();
    app.listen(config.app.port, () => {
        console.log(`Server running at http://localhost:${config.app.port}`)
        console.log(`Swagger docs available at http://localhost:${config.app.port}/docs`);
    });
});
