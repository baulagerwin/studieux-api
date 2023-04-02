import winston from "winston";

export default function () {
  winston.add(
    new winston.transports.File({
      filename: "exceptionsAndRejections.log",
      handleExceptions: true,
      handleRejections: true,
    })
  );
}
