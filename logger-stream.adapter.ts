

export class LoggerStreamAdapter<C, O> implements LogInputStream<LogBody<C, O>> {
    constructor(
        private readonly logMap: Map<LogLevel, Logging<C, O>>,
    ) {
    }

    public static asFullLevel<C, O>(logger: FullLevelLogger<C, O>): LogStreamAdapter<C, O> {
        return new LogStreamAdapter(new Map([
            [LogLevel.Fatal, logger.fatal.bind(logger)],
        ]));
    }
}
  
