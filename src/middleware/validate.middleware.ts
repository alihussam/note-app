import { schema, validate } from "express-validation";

/**
 * Validate middleware from express-validation with options set
 */
export default (schema: schema) =>
  validate(schema, { keyByField: true }, { abortEarly: false });
