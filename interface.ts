export enum LogLevel {
    Error = 'error',
    Warn = 'warn',
    Info = 'info',
    Debug = 'debug',
}

export interface Logger<M = {}, O = {}> {
    error(message: M, ...optional: O[]): void;
    warn(message: M, ...optional: O[]): void;
    info(message: M, ...optional: O[]): void;
    debug(message: M, ...optional: O[]): void;
}
export namespace Logger {
    function log<M, O>(logger: Logger<M, O>, level: LogLevel, message: M, ...optional: O[]): void {
        logger[level].call(logger, message, ...optional);
    }
}

export interface StrLogger<O> extends Logger<string, M> { }

export interface Log<M, O> {
    message: M;
    optional: O[];
}

export interface StrLog<O> extends Log<string, O> { }

export type LogRewrite<M, O> = (log: Log<M, O>) => void;
