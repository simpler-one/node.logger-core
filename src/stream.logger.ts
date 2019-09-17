import { Logger, Log, LogStream, LogLevel } from './interface';


export class StreamLogger<C, O, L extends Log<C, O> = Log<C, O>> implements Logger<C, O>, LogStream<L> {
    constructor(
        protected readonly stream: LogStream<Log<C, O>>,
    ) {
    }

    public error(content: C, ...optional: O[]): void {
        this.write(LogLevel.Error, this.createLog(content, optional));
    }
    public warn(content: C, ...optional: O[]): void {
        this.write(LogLevel.Warn, this.createLog(content, optional));
    }
    public info(content: C, ...optional: O[]): void {
        this.write(LogLevel.Info, this.createLog(content, optional));
    }
    public debug(content: C, ...optional: O[]): void {
        this.write(LogLevel.Debug, this.createLog(content, optional));
    }

    public write(level: LogLevel, log: L): void {
        this.stream.write(level, log);
    }

    /**
     * Create a log object.
     * This is called by every Logger's method
     * @param content content
     * @param optional optional
     */
    protected createLog(content: C, optional: O[]): L {
        return { content, optional } as L;
    }
}


