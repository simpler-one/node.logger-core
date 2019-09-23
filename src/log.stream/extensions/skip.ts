import { LogInputStream, Log } from '../../interface';
import { LogStream } from '../log.stream';

type Filter<T> = (log: Log<T>, histories: Log<T>[]) => boolean;
interface SkipFinishedParam {
    skipCount: number;
}

declare module '../log.stream' {
    interface LogStream<T> {
        skip(
            filter: Filter<T>,
            bufferSize?: number,
            onStartSkip?: () => Log<T>,
            onFinishSkip?: (params: SkipFinishedParam) => Log<T>,
        ): LogStream<T>;
    }
}


class SkippedLogStream<T> implements LogInputStream<T> {
    private skipCount: number = 0;
    private get skipping(): boolean {
        return this.skipCount > 0;
    }

    private readonly histories: Log<T>[] = [];

    constructor(
        private readonly stream: LogInputStream<T>,
        private readonly filter: Filter<T>,
        private readonly bufferSize: number,
        private readonly onStartSkip?: () => Log<T>,
        private readonly onFinishSkip?: (params: SkipFinishedParam) => Log<T>
    ) {
    }

    public write(log: Log<T>): void {
        if (this.filter(log, [...this.histories])) {
            if (!this.skipping && this.onStartSkip) {
                this.stream.write(this.onStartSkip());
            }

            this.skipCount++;
        } else {
            if (this.skipping && this.onFinishSkip) {
                this.stream.write(this.onFinishSkip({ skipCount: this.skipCount }));
            }

            this.stream.write(log);
            this.skipCount = 0;
        }

        this.histories.push(log);
        if (this.histories.length > this.bufferSize) {
            this.histories.shift();
        }
    }
}


LogStream.prototype.skip = function<T>(
    filter: Filter<T>,
    bufferSize?: number,
    onStartSkip?: () => Log<T>,
    onFinishSkip?: (params: SkipFinishedParam) => Log<T>,
): LogStream<T> {
    return new LogStream(new SkippedLogStream(this.stream, filter, bufferSize, onStartSkip, onFinishSkip));
}
