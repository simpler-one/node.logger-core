import { LogInputStream, Log, LogHeader } from "../interface";


export class LogStream<B, H extends LogHeader> implements LogInputStream<T> {
    /** Shorter stream */
    get shorterStream(): LogInputStream<B, H> {
        return this.constructor === LogStream ? this.stream : this;
    }

    constructor(
        protected readonly stream: LogInputStream<B, H>,
    ) {
    }

    public write(log: Log<B, H>): void {
        this.stream.write(log);
    }
}
