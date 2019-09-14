

type Any<O> = string | string[] | O;

export class TaggingLogger<O> extends RewritingLogger<O> {
    public error(message: string, ...optional: O[]): void;
    public error(tags: string[], message: string, ...optional: O[]): void;
    public error(args: Any<O>[]): void {
        
    }
    
    public tag(tags: string[]): TaggedLogger<O> {
        return new TaggedLogger(this.logger, tags);
    }
}

