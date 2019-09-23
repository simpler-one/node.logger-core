import { LogInputStream, Log } from '../../interface';
import { LogStream } from '../log.stream';


declare module '../log.stream' {
    interface LogStream<T> {
        tag(tags: string[]): LogStream<T>;
    }
}


class TaggedLogStream<T> implements LogInputStream<T> {
    constructor(
        private readonly stream: LogInputStream<T>,
        private readonly tags: string[],
    ) {
    }

    public write(log: Log<T>): void {
        const orgTags = log.header.tags ? log.header.tags : [];
        log.header.tags = [...orgTags, ...this.tags];
        this.stream.write(log);
    }
}


LogStream.prototype.tag = function<T>(tags: string[]): LogStream<T> {
    return new LogStream(new TaggedLogStream(this.stream, tags));
}
