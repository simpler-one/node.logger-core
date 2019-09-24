import { LogInputStream, Log, LogHeader } from '../../interface';
import { LogStream } from '../log.stream';


declare module '../log.stream' {
    interface LogStream<B, H extends LogHeader> {
        /**
         * Filter by tag.
         * And remove tags to filter.
         * @param tags tags to filter
         */
        filterByTag(...tags: string[]): LogStream<B, H>;
        /**
         * Filter by tag.
         * @param removeTags remove tags filtered
         * @param tags tags to filter
         */
        filterByTag(removeTags: boolean, ...tags: string[]): LogStream<B, H>;
    }
}


class TagFilteredLogStream<B, H> extends LogStream<B, H> {
    constructor(
        stream: LogInputStream<B, H>,
        private readonly tags: string[],
        private readonly removeTags: boolean,
    ) {
        super(stream);
    }

    public write(log: Log<B, H>): void {
        const result = this.filter(log.header.tags);
        if (result) {
            log.header.tags = result;
            this.stream.write(log);
        }
    }

    private filter(tags?: string[]): string[] {
        if (!tags) {
            return undefined;
        }

        const tagSet = new Set(tags);
        if (this.tags.some(tag => !tagSet.has(tag))) {
            return undefined;
        }

        if (!this.removeTags) {
            return tags;
        }

        this.tags.forEach(tag => tagSet.delete(tag));
        return [...tagSet.values()];
    }
}


LogStream.prototype.filterByTag = function<B, H>(...params: (boolean | string)[]): LogStream<B, H> {
    let removeTags = true;
    if (typeof params[0] === 'boolean') {
        removeTags = params[0];
        params.shift();
    }

    return new TagFilteredLogStream(this.shorterStream, params as string[], removeTags);
}
