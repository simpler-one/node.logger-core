export type Logging<C, O> = (content: C, ...optional: O[]): void;
export type SingleLogging<T> = (log: T): void;

export interface MinimumLogger<C = string, O = {}> {
    readonly error: Logging<C, O>;
    readonly info: Logging<C, O>;
}
export interface NormalLogger<C = string, O = {}> extends MinimumLogger<C, O> {
    readonly error: Logging<C, O>;
    readonly warn: Logging<C, O>;
    readonly info: Logging<C, O>;
    readonly debug: Logging<C, O>;
}
export interface FullLogger<C = string, O = {}> extends NormalLogger<C, O> {
    readonly fatal: Logging<C, O>;
    readonly error: Logging<C, O>;
    readonly warn: Logging<C, O>;
    readonly info: Logging<C, O>;
    readonly debug: Logging<C, O>;
    readonly trace: Logging<C, O>;
}

export interface MinimumSingleLogger<T = string> {
    readonly error: SingleLogging<T>;
    readonly info: SingleLogging<T>;
}
export interface NormalSingleLogger<T = string> extends MinimumSingleLogger<T> {
    readonly error: SingleLogging<T>;
    readonly warn: SingleLogging<T>;
    readonly info: SingleLogging<T>;
    readonly debug: SingleLogging<T>;
}
export interface FullSingleLogger<T = string> extends NormalSingleLogger<T> {
    readonly fatal: SingleLogging<T>;
    readonly error: SingleLogging<T>;
    readonly warn: SingleLogging<T>;
    readonly info: SingleLogging<T>;
    readonly debug: SingleLogging<T>;
    readonly trace: SingleLogging<T>;
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
