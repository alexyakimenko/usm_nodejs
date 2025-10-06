import type { Request, Response } from "express"

class AboutController {
    render(req: Request, res: Response) {
        res.render('about')
    }
}

export default new AboutController()