import type { Request, Response, NextFunction } from "express"
import { ZodObject, ZodError } from "zod"

/**
 * @param schema  Schema Object to compare against ZodSchema
 * @param req     Request object from express
 * @param res     Response object from express
 * @param next    Next middleware function from express
 * @returns       Response object from express || calls next middleware function
 */

export const validateRequest = (schema: ZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const parsedData = { ...req.body, ...req.query, ...req.params }
        const arrayFields = ['artistIds', 'genreIds']
        for (const field of arrayFields) {
            if (typeof req.body[field] === 'string') {
                try {
                    req.body[field] = JSON.parse(req.body[field]);
                } catch {
                    req.body[field] = req.body[field].split(',').map((v: string) => v.trim());
                }
            }
        }
        schema.parse(req.body)
        next()
    } catch (error) {
        //Example of ZodError when min() is not satisfied for firstName
        /**
         * [
              {
                  code: "too_small",
                  message: "Please enter your first name!",
                  path: ["firstName"],
                  minimum: 1,
                  type: "string",
                  inclusive: true,
                  received: 0
              }
          ]
         */
        if (error instanceof ZodError) {
            //We return error of status code 422 - Unprocessable Content
            //We map throught the error object to get the path and set it as field
            //message is what we have set as error message in our ZodSchema
            //Used https://github.com/colinhacks/zod/discussions/3217 as reference
            return res.status(422).send({
                errors: error.issues.map((error) => ({
                    field: error.path[1], message: error.message
                }))
            })
            //Example of response from above return statement
            // {
            //   "errors": [
            //     {
            //       "field": "lastName",
            //       "message": "Please enter your last name!"
            //     },
            //     {
            //       "field": "password",
            //       "message": "Please enter password of length 8 or more!"
            //     }
            //   ]
            // }
        }
        next(error)
    }
}