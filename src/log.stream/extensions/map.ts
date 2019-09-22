import { LogInputStream, Log } from '../../interface';
import { LogStream } from '../log.stream';

type Mapping<I, O> = (log: Log<I>) => Log<O>;

declare module '../log.stream' {
    interface LogStream<T> {
        map<U>(mapping: Mapping<U, T>): LogStream<U>;
    }
}


class MappedLogStream<T, U> implements LogInputStream<T> {
    constructor(
        private readonly stream: LogInputStream<U>,
        private readonly mapping: Mapping<T, U>,
    ) {
    }

    public write(log: Log<T>): void {
        this.stream.write(this.mapping(log));
    }
}


LogStream.prototype.map = function<T, U>(mapping: Mapping<U, T>): LogStream<U> {
    return new LogStream(new MappedLogStream(this.stream, mapping));
}
