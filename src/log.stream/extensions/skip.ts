import { LogInputStream, Log } from '../../interface';
import { LogStream } from '../log.stream';

type Filter<T> = (log: Log<T>) => boolean;
interface SkipFinishedParam {
    skipCount: number;
}

declare module '../log.stream' {
    interface LogStream<T> {
        skip(filter: Filter<T>, onStartSkip: () => Log<T>, onFinishSkip: (params: SkipFinishedParam) => Log<T>): LogStream<T>;
    }
}


class SkippedLogStream<T> implements LogInputStream<T> {
    private skipCount: number = 0;
    private get skipping(): boolean {
        return this.skipCount > 0;
    }

    constructor(
        private readonly stream: LogInputStream<T>,
        private readonly filter: Filter<T>,
        private readonly onStartSkip?: () => Log<T>,
        private readonly onFinishSkip?: (params: SkipFinishedParam) => Log<T>
    ) {
    }

    public write(log: Log<T>): void {
        if (this.filter(log)) {
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
    }
}


LogStream.prototype.skip = function<T>(filter: Filter<T>): LogStream<T> {
    return new LogStream(new SkippedLogStream(this.stream, filter));
}
