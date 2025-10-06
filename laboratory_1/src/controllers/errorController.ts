import type { Request, Response } from "express"

class ErrorController {
    notFound(req: Request, res: Response) {
        res.status(404).render('404')
    }
}

export default new ErrorController()