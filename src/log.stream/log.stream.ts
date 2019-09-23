import { LogInputStream, Log } from "../interface";


export class LogStream<T> implements LogInputStream<T> {
    /** Shorter stream */
    get shorterStream(): LogInputStream<T> {
        return this.constructor === LogStream ? this.stream : this;
    }

    constructor(
        protected readonly stream: LogInputStream<T>,
    ) {
    }

    public write(log: Log<T>): void {
        this.stream.write(log);
    }
}
