import { myLogger } from "../utils/mylogger";

export const logMiddleware = (req, res, next) => {
    myLogger.info(`${new Date().toISOString()} METHOD=${req.method} URL=${req.url} IP=${req.ip}`);
    next();
};
