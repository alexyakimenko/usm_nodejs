import {NextFunction, Request, Response} from "express";

// хз почему-то и без этого ловит ошибки
// мб проблема старой версии экспресса?
const asyncWrapper = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
}

export default asyncWrapper;