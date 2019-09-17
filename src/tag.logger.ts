import { Logger, LogLevel, TaggedLog, LogStream } from "./interface";


type Any<C, O> = C | string[] | O;


export class TagLogger<C = string, O = {}> implements Logger<C, O>, LogStream<TaggedLog<C, O>> {
    constructor(
        protected readonly logger: LogStream<TaggedLog<C, O>>,
        protected readonly tags: string[] = [],
    ) {
    }

    public error(content: C, ...optional: O[]): void;
    public error(tags: string[], content: C, ...optional: O[]): void;
    public error(...args: Any<C, O>[]): void {
        this.logAny(LogLevel.Error, args);
    }
    public warn(content: C, ...optional: O[]): void;
    public warn(tags: string[], content: C, ...optional: O[]): void;
    public warn(...args: Any<C, O>[]): void {
        this.logAny(LogLevel.Warn, args);
    }
    public info(content: C, ...optional: O[]): void;
    public info(tags: string[], content: C, ...optional: O[]): void;
    public info(...args: Any<C, O>[]): void {
        this.logAny(LogLevel.Info, args);
    }
    public debug(content: C, ...optional: O[]): void;
    public debug(tags: string[], content: C, ...optional: O[]): void;
    public debug(...args: Any<C, O>[]): void {
        this.logAny(LogLevel.Debug, args);
    }

    public write(level: LogLevel, log: TaggedLog<C, O>): void {
        log.tags = [...log.tags, ...this.tags];
        this.logger.write(level, log);
    }


    public tag(tags: string[]): TagLogger<C, O> {
        return new TagLogger(this.logger, tags);
    }


    private logAny(level: LogLevel, args: Any<C, O>[]): void {
        const log: TaggedLog<C, O> = args[0] instanceof Array
            ? { tags: args[0], content: args[1] as C, optional: args.slice(2) as O[] }
            : { tags: [], content: args[0] as C, optional: args.slice(1) as O[] }
        ;

        this.logger.write(level, log);
    }
}
