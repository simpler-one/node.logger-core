import { Logger, Log } from './interface';

export abstract class RewritingLogger<M, O> implements Logger<M, O> {
    constructor(
        protected readonly logger: Logger<M, O>,
    ) {
    }

    public error(message: M, ...optional: O[]): void {
        const log = { message, optional };
        this.rewrite(log);
        this.logger.error(log.message, ...log.optional);
    }
    public warn(message: M, ...optional: O[]): void;
    public info(message: M, ...optional: O[]): void;
    public debug(message: M, ...optional: O[]): void;
    
    protected abstract rewrite(log: Log<M, O>): void;
}


