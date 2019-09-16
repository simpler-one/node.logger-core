import { Logger, LogLevel, TaggedLog, GenericLogger } from "./interface";


type Any<C, O> = C | string[] | O;


export class TaggingLogger<C = string, O = {}> implements Logger<C, O>, GenericLogger<TaggedLog<C, O>> {
    constructor(
        protected readonly logger: GenericLogger<TaggedLog<C, O>>,
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

    public log(level: LogLevel, log: TaggedLog<C, O>): void {
        log.tags = [...log.tags, ...this.tags];
        this.logger.log(level, log);
    }


    public tag(tags: string[]): TaggingLogger<C, O> {
        return new TaggingLogger(this.logger, tags);
    }


    private logAny(level: LogLevel, args: Any<C, O>[]): void {
        if (args[0] instanceof Array) {
            this.logWithTags(level, ...args);
        } else {
            this.logWithoutTags(level, ...args);
        }
    }

    private logWithTags(level: LogLevel, ...args: Any<C, O>[]): void;
    private logWithTags(level: LogLevel, tags: string[], content: C, ...optional: O[]): void {
        const log = { content, optional, tags: [...tags, ...this.tags] };
        this.logger.log(level, log);
    }

    private logWithoutTags(level: LogLevel, ...args: Any<C, O>[]): void;
    private logWithoutTags(level: LogLevel, content: C, ...optional: O[]): void {
        const log = { content, optional, tags: [...this.tags] };
        this.logger.log(level, log);
    }
}
