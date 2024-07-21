import type { RequestHandler } from "express";

const tryCatch =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// module.exports = tryCatch;
export default tryCatch;
