export enum LogLevel {
    Error = 'error',
    Warn = 'warn',
    Info = 'info',
    Debug = 'debug',
}

export interface Logger<C = string, O = {}> {
    error(content: C, ...optional: O[]): void;
    warn(content: C, ...optional: O[]): void;
    info(content: C, ...optional: O[]): void;
    debug(content: C, ...optional: O[]): void;
}
export namespace Logger {
    export function log<C = string, O = {}>(logger: Logger<C, O>, level: LogLevel, content: C, optional: O[]): void {
        logger[level].call(logger, content, ...optional);
    }
}

export interface LogStream<L> {
    write(level: LogLevel, log: L): void;
}

export interface Log<C = string, O = {}> {
    content: C;
    optional: O[];
}

export interface TaggedLog<C = string, O = {}> extends Log<C, O> {
    tags: string[];
}

export type LogRewrite<C = string, O = {}> = (log: Log<C, O>) => void;
