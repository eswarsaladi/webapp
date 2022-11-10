const morgan = require("morgan");
const logger = require("../../logger");
const metrics = require("../../statsd");

const stream = {
  write: (message) => {
    logger.http(message.toString());
    metrics.increment("webapp.service");
  },
};

const skip = () => false;

const morganMiddleware = morgan("combined", { stream, skip });

module.exports = morganMiddleware;
