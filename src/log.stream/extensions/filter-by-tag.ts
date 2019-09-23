import { LogInputStream, Log } from '../../interface';
import { LogStream } from '../log.stream';


declare module '../log.stream' {
    interface LogStream<T> {
        /**
         * Filter by tag.
         * And remove tags to filter.
         * @param tags tags to filter
         */
        filterByTag(...tags: string[]): LogStream<T>;
        /**
         * Filter by tag.
         * @param removeTags remove tags filtered
         * @param tags tags to filter
         */
        filterByTag(removeTags: boolean, ...tags: string[]): LogStream<T>;
    }
}


class TagFilteredLogStream<T> extends LogStream<T> {
    constructor(
        stream: LogInputStream<T>,
        private readonly tags: string[],
        private readonly removeTags: boolean,
    ) {
        super(stream);
    }

    public write(log: Log<T>): void {
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


LogStream.prototype.filterByTag = function<T>(...params: (boolean | string)[]): LogStream<T> {
    let removeTags = true;
    if (typeof params[0] === 'boolean') {
        removeTags = params[0];
        params.shift();
    }

    return new TagFilteredLogStream(this.shorterStream, params as string[], removeTags);
}
