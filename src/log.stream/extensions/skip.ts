import { LogInputStream, Log, LogHeader } from '../../interface';
import { LogStream } from '../log.stream';

type Filter<B, H extends LogHeader> = (log: Log<B, H>, histories: Log<B, H>[]) => boolean;
interface SkipFinishedParam<B, H extends LogHeader> {
    skipCount: number;
    histories: Log<B, H>[];
}

declare module '../log.stream' {
    interface LogStream<B, H> {
        /**
         * Skip filtered log.
         * @param filter filter to skip.
         * @param bufferSize history buffer size for filter callback
         * @param onStartSkip log generator at starting skip
         * @param onFinishSkip log generator at finishing skip
         */
        skip(
            filter: Filter<B, H>,
            bufferSize?: number,
            onStartSkip?: () => Log<B, H>,
            onFinishSkip?: (params: SkipFinishedParam<B, H>) => Log<B, H>,
        ): LogStream<B, H>;
    }
}


class SkippedLogStream<B, H extends LogHeader> extends LogStream<B, H> {
    private skipCount: number = 0;
    private get skipping(): boolean {
        return this.skipCount > 0;
    }

    private readonly histories: Log<B, H>[] = [];

    constructor(
        stream: LogInputStream<B, H>,
        private readonly filter: Filter<B, H>,
        private readonly bufferSize: number,
        private readonly onStartSkip?: () => Log<B, H>,
        private readonly onFinishSkip?: (params: SkipFinishedParam<B, H>) => Log<B, H>
    ) {
        super(stream);
    }

    public write(log: Log<B, H>): void {
        if (this.filter(log, [...this.histories])) {
            if (!this.skipping && this.onStartSkip) {
                this.stream.write(this.onStartSkip());
            }

            this.skipCount++;
        } else {
            if (this.skipping && this.onFinishSkip) {
                this.stream.write(this.onFinishSkip({ skipCount: this.skipCount, histories: [...this.histories] }));
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


LogStream.prototype.skip = function<B, H extends LogHeader>(
    filter: Filter<B, H>,
    bufferSize?: number,
    onStartSkip?: () => Log<B, H>,
    onFinishSkip?: (params: SkipFinishedParam<B, H>) => Log<B, H>,
): LogStream<B> {
    return new SkippedLogStream(this.shorterStream, filter, bufferSize, onStartSkip, onFinishSkip);
}
