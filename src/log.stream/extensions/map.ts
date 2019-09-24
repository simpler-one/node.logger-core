import { LogInputStream, Log, LogHeader } from '../../interface';
import { LogStream } from '../log.stream';

type Mapping<I, O, H extends LogHeader> = (log: Log<I, H>) => Log<O, H>;

declare module '../log.stream' {
    interface LogStream<B, H> {
        map<B2>(mapping: Mapping<B2, B, H>): LogStream<B2, H>;
    }
}


class MappedLogStream<BI, BO, H extends LogHeader> implements LogInputStream<BI, H> {
    constructor(
        private readonly stream: LogInputStream<BO>,
        private readonly mapping: Mapping<BI, BO, H>,
    ) {
    }

    public write(log: Log<BI, H>): void {
        this.stream.write(this.mapping(log));
    }
}


LogStream.prototype.map = function<B, B2, H extends LogHeader>(mapping: Mapping<B2, B, H>): LogStream<B2, H> {
    return new LogStream(new MappedLogStream(this.shorterStream, mapping));
}
