import { ZodError } from "zod";

export const formatZodErrors = (errors: ZodError<any>): any => {
  return errors.errors.map((error) => ({
    path: error.path[0],
    message: error.message,
  }));
};
