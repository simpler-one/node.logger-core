import { Log, LogLevel } from '../../interface';
import { LogStream } from '../log.stream';


declare module '../log.stream' {
    interface LogStream<B> {
        log(level: LogLevel, body: B): void;
    }
}

LogStream.prototype.log = function<B>(level: LogLevel, body: B): void {
    const log: Log<B> = { header: { level, time: new Date() }, body };
    this.write(log);
}
