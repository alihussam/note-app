import { Joi, schema } from "express-validation";

export const DEFAULT_PAGE_LIMIT = 10;

export interface GetNotesQuery {
  page?: number;
  limit?: number;
}

export const getNotesRequestValidation: schema = {
  query: Joi.object({
    page: Joi.number().optional(),
    limit: Joi.number().optional().default(DEFAULT_PAGE_LIMIT),
  }),
};
