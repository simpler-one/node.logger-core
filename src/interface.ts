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
    time?: Date;
    level: LogLevel;
    tags?: string[];
}

export interface Log<B, H extends LogHeader = LogHeader> {
    header: H;
    body: B;
}

export interface LogBody<C, O> {
    content: C;
    optional: O[];
}

export interface LogInputStream<B, H extends LogHeader = LogHeader> {
    write(log: Log<B, H>): void;
}
