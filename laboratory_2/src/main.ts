import express from "express";
import { sequelize } from "@/models";
import config from '@/config/config'
import todosRouter from "@/routes/todos.routes";
import categoriesRouter from "@/routes/categories.routes";
import {setupSwagger} from "@/swagger";

const app = express();
app.use(express.json());

app.use("/api/todos", todosRouter);
app.use("/api/categories", categoriesRouter);

setupSwagger(app);

sequelize.sync({ alter: true }).then(() => {
    app.listen(config.app.port, () => {
        console.log(`Server running at http://localhost:${config.app.port}`)
        console.log(`Swagger docs available at http://localhost:${config.app.port}/docs`);
    });
});
