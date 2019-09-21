import { LogInputStream, Log } from "../interface";


export class LogStream<T> implements LogInputStream<T> {
    constructor(
        protected readonly stream: LogInputStream<T>,
    ) {
    }

    public write(log: Log<T>): void {
        this.stream.write(log);
    }
}
