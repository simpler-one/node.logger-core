import { Logger, Log, GenericLogger, LogLevel } from './interface';


export abstract class RewritingLogger<C, O> implements Logger<C, O>, GenericLogger<Log<C, O>> {
    constructor(
        protected readonly logger: GenericLogger<Log<C, O>>,
    ) {
    }

    public error(content: C, ...optional: O[]): void {
        const log = { content, optional };
        this.rewrite(log);
        this.logger.log(LogLevel.Error, log);
    }
    public warn(content: C, ...optional: O[]): void {
        const log = { content, optional };
        this.rewrite(log);
        this.logger.log(LogLevel.Warn, log);
    }
    public info(content: C, ...optional: O[]): void {
        const log = { content, optional };
        this.rewrite(log);
        this.logger.log(LogLevel.Info, log);
    }
    public debug(content: C, ...optional: O[]): void {
        const log = { content, optional };
        this.rewrite(log);
        this.logger.log(LogLevel.Debug, log);
    }

    public log(level: LogLevel, log: Log<C, O>): void {
        this.rewrite(log);
        this.logger.log(level, log);
    }

    protected abstract rewrite(log: Log<C, O>): void;
}


