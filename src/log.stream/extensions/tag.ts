import { LogInputStream, Log, LogHeader } from '../../interface';
import { LogStream } from '../log.stream';


declare module '../log.stream' {
    interface LogStream<B, H> {
        tag(tags: string[]): LogStream<B, H>;
    }
}


class TaggedLogStream<B, H extends LogHeader> extends LogStream<B, H> {
    constructor(
        stream: LogInputStream<B, H>,
        private readonly tags: string[],
    ) {
        super(stream);
    }

    public write(log: Log<B, H>): void {
        const orgTags = log.header.tags ? log.header.tags : [];
        log.header.tags = [...orgTags, ...this.tags];
        this.stream.write(log);
    }
}


LogStream.prototype.tag = function<B, H extends LogHeader>(tags: string[]): LogStream<B, H> {
    return new TaggedLogStream(this.shorterStream, tags);
}
