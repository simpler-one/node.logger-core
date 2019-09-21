export interface Logger<C = string, O = {}> {
    error(content: C, ...optional: O[]): void;
    warn(content: C, ...optional: O[]): void;
    info(content: C, ...optional: O[]): void;
    debug(content: C, ...optional: O[]): void;
}

export enum LogLevel {
    Fatal,
    Error,
    Warn,
    Info,
    Debug,
    Trace,
}

export interface LogHeader {
    level: LogLevel;
    tags: string[];
}

export interface Log<T> {
    header: LogHeader;
    body: T;
}

export interface LogBody<C, O> {
    content: C;
    optional: O[];
}

export interface LogInputStream<T> {
    write(log: Log<T>): void;
}
