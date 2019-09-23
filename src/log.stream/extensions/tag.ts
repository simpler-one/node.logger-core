import { LogInputStream, Log } from '../../interface';
import { LogStream } from '../log.stream';


declare module '../log.stream' {
    interface LogStream<T> {
        tag(tags: string[]): LogStream<T>;
    }
}


class TaggedLogStream<T> extends LogStream<T> {
    constructor(
        stream: LogInputStream<T>,
        private readonly tags: string[],
    ) {
        super(stream);
    }

    public write(log: Log<T>): void {
        const orgTags = log.header.tags ? log.header.tags : [];
        log.header.tags = [...orgTags, ...this.tags];
        this.stream.write(log);
    }
}


LogStream.prototype.tag = function<T>(tags: string[]): LogStream<T> {
    return new TaggedLogStream(this.shorterStream, tags);
}
