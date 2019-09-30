

export class LoggerStreamAdapter<C, O> implements LogInputStream<LogBody<C, O>> {
    constructor(
        private readonly logMap: Map<LogLevel, Logging<C, O>>,
    ) {
    }

    public static asFull<C, O>(logger: FullLevelLogger<C, O>): LogStreamAdapter<C, O> {
        return new LogStreamAdapter(new Map([
            [LogLevel.Fatal, logger.fatal.bind(logger)],
            [LogLevel.Error, logger.error.bind(logger)],
            [LogLevel.Warn, logger.warn.bind(logger)],
            [LogLevel.Info, logger.info.bind(logger)],
            [LogLevel.Debug, logger.debug.bind(logger)],
            [LogLevel.Trace, logger.trace.bind(logger)],
        ]));
    }
    public static asNormal<C, O>(logger: FullLevelLogger<C, O>): LogStreamAdapter<C, O> {
        return new LogStreamAdapter(new Map([
            [LogLevel.Fatal, logger.error.bind(logger)],
            [LogLevel.Error, logger.error.bind(logger)],
            [LogLevel.Warn, logger.warn.bind(logger)],
            [LogLevel.Info, logger.info.bind(logger)],
            [LogLevel.Debug, logger.debug.bind(logger)],
            [LogLevel.Trace, logger.debug.bind(logger)],
        ]));
    }
    public static asMinimum<C, O>(logger: FullLevelLogger<C, O>): LogStreamAdapter<C, O> {
        return new LogStreamAdapter(new Map([
            [LogLevel.Fatal, logger.error.bind(logger)],
            [LogLevel.Error, logger.error.bind(logger)],
            [LogLevel.Warn, logger.error.bind(logger)],
            [LogLevel.Info, logger.info.bind(logger)],
            [LogLevel.Debug, logger.info.bind(logger)],
            [LogLevel.Trace, logger.info.bind(logger)],
        ]));
    }


}
  
