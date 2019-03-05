//TODO: actually specify these types
export class Header {
    constructor(data: any, off: any, ex: any, gex: any);
    cksumValid: any;
    needPax: any;
    nullBlock: any;
    block: any;
    path: any;
    mode: any;
    uid: any;
    gid: any;
    size: any;
    mtime: any;
    cksum: any;
    linkpath: any;
    uname: any;
    gname: any;
    devmaj: any;
    devmin: any;
    atime: any;
    ctime: any;
    decode(buf: any, off: any, ex: any, gex: any): void;
    encode(buf: any, off: any): any;
    set(data: any): void;
}
export class Pack {
    static defaultMaxListeners: any;
    static init(): void;
    static listenerCount(emitter: any, type: any): any;
    static usingDomains: boolean;
    add(path: any): any;
    addListener(ev: any, fn: any): any;
    collect(): any;
    emit(ev: any, data: any, ...args: any[]): any;
    end(path: any): any;
    eventNames(): any;
    getMaxListeners(): any;
    listenerCount(type: any): any;
    listeners(type: any): any;
    off(type: any, listener: any): any;
    on(ev: any, fn: any): any;
    once(type: any, listener: any): any;
    pause(): any;
    pipe(dest: any, opts: any): any;
    prependListener(type: any, listener: any): any;
    prependOnceListener(type: any, listener: any): any;
    rawListeners(type: any): any;
    read(n: any): any;
    removeAllListeners(type: any, ...args: any[]): any;
    removeListener(type: any, listener: any): any;
    resume(): any;
    setEncoding(enc: any): void;
    setMaxListeners(n: any): any;
    warn(msg: any, data: any): void;
    write(path: any): any;
}
export namespace Pack {
    class EventEmitter {
        // Circular reference from index.Pack.EventEmitter
        static EventEmitter: any;
        static defaultMaxListeners: any;
        static init(): void;
        static listenerCount(emitter: any, type: any): any;
        static usingDomains: boolean;
        addListener(type: any, listener: any): any;
        emit(type: any, args: any): any;
        eventNames(): any;
        getMaxListeners(): any;
        listenerCount(type: any): any;
        listeners(type: any): any;
        off(type: any, listener: any): any;
        on(type: any, listener: any): any;
        once(type: any, listener: any): any;
        prependListener(type: any, listener: any): any;
        prependOnceListener(type: any, listener: any): any;
        rawListeners(type: any): any;
        removeAllListeners(type: any, ...args: any[]): any;
        removeListener(type: any, listener: any): any;
        setMaxListeners(n: any): any;
    }
    class Sync {
        // Circular reference from index.Pack.Sync
        static Sync: any;
        static defaultMaxListeners: any;
        static init(): void;
        static listenerCount(emitter: any, type: any): any;
        static usingDomains: boolean;
        constructor(opt: any);
        add(path: any): any;
        addListener(ev: any, fn: any): any;
        collect(): any;
        emit(ev: any, data: any, ...args: any[]): any;
        end(path: any): any;
        eventNames(): any;
        getMaxListeners(): any;
        listenerCount(type: any): any;
        listeners(type: any): any;
        off(type: any, listener: any): any;
        on(ev: any, fn: any): any;
        once(type: any, listener: any): any;
        pause(): void;
        pipe(dest: any, opts: any): any;
        prependListener(type: any, listener: any): any;
        prependOnceListener(type: any, listener: any): any;
        rawListeners(type: any): any;
        read(n: any): any;
        removeAllListeners(type: any, ...args: any[]): any;
        removeListener(type: any, listener: any): any;
        resume(): void;
        setEncoding(enc: any): void;
        setMaxListeners(n: any): any;
        warn(msg: any, data: any): void;
        write(path: any): any;
    }
    namespace Sync {
        class EventEmitter {
            // Circular reference from index.Pack.Sync.EventEmitter
            static EventEmitter: any;
            static defaultMaxListeners: any;
            static init(): void;
            static listenerCount(emitter: any, type: any): any;
            static usingDomains: boolean;
            addListener(type: any, listener: any): any;
            emit(type: any, args: any): any;
            eventNames(): any;
            getMaxListeners(): any;
            listenerCount(type: any): any;
            listeners(type: any): any;
            off(type: any, listener: any): any;
            on(type: any, listener: any): any;
            once(type: any, listener: any): any;
            prependListener(type: any, listener: any): any;
            prependOnceListener(type: any, listener: any): any;
            rawListeners(type: any): any;
            removeAllListeners(type: any, ...args: any[]): any;
            removeListener(type: any, listener: any): any;
            setMaxListeners(n: any): any;
        }
    }
}
export class Parse {
    static defaultMaxListeners: any;
    static init(): void;
    static listenerCount(emitter: any, type: any): any;
    static usingDomains: boolean;
    abort(msg: any, error: any): void;
    addListener(type: any, listener: any): any;
    emit(type: any, args: any): any;
    end(chunk: any): void;
    eventNames(): any;
    getMaxListeners(): any;
    listenerCount(type: any): any;
    listeners(type: any): any;
    off(type: any, listener: any): any;
    on(type: any, listener: any): any;
    once(type: any, listener: any): any;
    prependListener(type: any, listener: any): any;
    prependOnceListener(type: any, listener: any): any;
    rawListeners(type: any): any;
    removeAllListeners(type: any, ...args: any[]): any;
    removeListener(type: any, listener: any): any;
    setMaxListeners(n: any): any;
    warn(msg: any, data: any): void;
    write(chunk: any): any;
}
export namespace Parse {
    class EventEmitter {
        // Circular reference from index.Parse.EventEmitter
        static EventEmitter: any;
        static defaultMaxListeners: any;
        static init(): void;
        static listenerCount(emitter: any, type: any): any;
        static usingDomains: boolean;
        addListener(type: any, listener: any): any;
        emit(type: any, args: any): any;
        eventNames(): any;
        getMaxListeners(): any;
        listenerCount(type: any): any;
        listeners(type: any): any;
        off(type: any, listener: any): any;
        on(type: any, listener: any): any;
        once(type: any, listener: any): any;
        prependListener(type: any, listener: any): any;
        prependOnceListener(type: any, listener: any): any;
        rawListeners(type: any): any;
        removeAllListeners(type: any, ...args: any[]): any;
        removeListener(type: any, listener: any): any;
        setMaxListeners(n: any): any;
    }
}
export class Pax {
    static parse(string: any, ex: any, g: any): void;
    constructor(obj: any, global: any);
    atime: any;
    charset: any;
    comment: any;
    ctime: any;
    gid: any;
    gname: any;
    linkpath: any;
    mtime: any;
    path: any;
    size: any;
    uid: any;
    uname: any;
    dev: any;
    ino: any;
    nlink: any;
    global: any;
    encode(): any;
    encodeBody(): any;
    encodeField(field: any): any;
}
export class ReadEntry {
    static defaultMaxListeners: any;
    static init(): void;
    static listenerCount(emitter: any, type: any): any;
    static usingDomains: boolean;
    constructor(header: any, ex: any, gex: any);
    extended: any;
    globalExtended: any;
    header: any;
    startBlockSize: any;
    blockRemain: any;
    remain: any;
    type: any;
    meta: any;
    ignore: any;
    path: any;
    mode: any;
    uid: any;
    gid: any;
    uname: any;
    gname: any;
    size: any;
    mtime: any;
    atime: any;
    ctime: any;
    linkpath: any;
    addListener(ev: any, fn: any): any;
    collect(): any;
    emit(ev: any, data: any, ...args: any[]): any;
    end(chunk: any, encoding: any, cb: any): void;
    eventNames(): any;
    getMaxListeners(): any;
    listenerCount(type: any): any;
    listeners(type: any): any;
    off(type: any, listener: any): any;
    on(ev: any, fn: any): any;
    once(type: any, listener: any): any;
    pause(): void;
    pipe(dest: any, opts: any): any;
    prependListener(type: any, listener: any): any;
    prependOnceListener(type: any, listener: any): any;
    rawListeners(type: any): any;
    read(n: any): any;
    removeAllListeners(type: any, ...args: any[]): any;
    removeListener(type: any, listener: any): any;
    resume(): any;
    setEncoding(enc: any): void;
    setMaxListeners(n: any): any;
    write(data: any): any;
}
export namespace ReadEntry {
    class EventEmitter {
        // Circular reference from index.ReadEntry.EventEmitter
        static EventEmitter: any;
        static defaultMaxListeners: any;
        static init(): void;
        static listenerCount(emitter: any, type: any): any;
        static usingDomains: boolean;
        addListener(type: any, listener: any): any;
        emit(type: any, args: any): any;
        eventNames(): any;
        getMaxListeners(): any;
        listenerCount(type: any): any;
        listeners(type: any): any;
        off(type: any, listener: any): any;
        on(type: any, listener: any): any;
        once(type: any, listener: any): any;
        prependListener(type: any, listener: any): any;
        prependOnceListener(type: any, listener: any): any;
        rawListeners(type: any): any;
        removeAllListeners(type: any, ...args: any[]): any;
        removeListener(type: any, listener: any): any;
        setMaxListeners(n: any): any;
    }
}
export class Unpack {
    static defaultMaxListeners: any;
    static init(): void;
    static listenerCount(emitter: any, type: any): any;
    static usingDomains: boolean;
    constructor(opt: any);
    transform: any;
    writable: any;
    readable: any;
    dirCache: any;
    uid: any;
    gid: any;
    setOwner: any;
    preserveOwner: any;
    processUid: any;
    processGid: any;
    forceChown: any;
    win32: any;
    newer: any;
    keep: any;
    noMtime: any;
    preservePaths: any;
    unlink: any;
    cwd: any;
    strip: any;
    processUmask: any;
    umask: any;
    dmode: any;
    fmode: any;
    abort(msg: any, error: any): void;
    addListener(type: any, listener: any): any;
    emit(type: any, args: any): any;
    end(chunk: any): void;
    eventNames(): any;
    getMaxListeners(): any;
    listenerCount(type: any): any;
    listeners(type: any): any;
    off(type: any, listener: any): any;
    on(type: any, listener: any): any;
    once(type: any, listener: any): any;
    prependListener(type: any, listener: any): any;
    prependOnceListener(type: any, listener: any): any;
    rawListeners(type: any): any;
    removeAllListeners(type: any, ...args: any[]): any;
    removeListener(type: any, listener: any): any;
    setMaxListeners(n: any): any;
    warn(msg: any, data: any): void;
    write(chunk: any): any;
}
export namespace Unpack {
    class EventEmitter {
        // Circular reference from index.Unpack.EventEmitter
        static EventEmitter: any;
        static defaultMaxListeners: any;
        static init(): void;
        static listenerCount(emitter: any, type: any): any;
        static usingDomains: boolean;
        addListener(type: any, listener: any): any;
        emit(type: any, args: any): any;
        eventNames(): any;
        getMaxListeners(): any;
        listenerCount(type: any): any;
        listeners(type: any): any;
        off(type: any, listener: any): any;
        on(type: any, listener: any): any;
        once(type: any, listener: any): any;
        prependListener(type: any, listener: any): any;
        prependOnceListener(type: any, listener: any): any;
        rawListeners(type: any): any;
        removeAllListeners(type: any, ...args: any[]): any;
        removeListener(type: any, listener: any): any;
        setMaxListeners(n: any): any;
    }
    class Sync {
        // Circular reference from index.Unpack.Sync
        static Sync: any;
        static defaultMaxListeners: any;
        static init(): void;
        static listenerCount(emitter: any, type: any): any;
        static usingDomains: boolean;
        constructor(opt: any);
        abort(msg: any, error: any): void;
        addListener(type: any, listener: any): any;
        emit(type: any, args: any): any;
        end(chunk: any): void;
        eventNames(): any;
        getMaxListeners(): any;
        listenerCount(type: any): any;
        listeners(type: any): any;
        off(type: any, listener: any): any;
        on(type: any, listener: any): any;
        once(type: any, listener: any): any;
        prependListener(type: any, listener: any): any;
        prependOnceListener(type: any, listener: any): any;
        rawListeners(type: any): any;
        removeAllListeners(type: any, ...args: any[]): any;
        removeListener(type: any, listener: any): any;
        setMaxListeners(n: any): any;
        warn(msg: any, data: any): void;
        write(chunk: any): any;
    }
    namespace Sync {
        class EventEmitter {
            // Circular reference from index.Unpack.Sync.EventEmitter
            static EventEmitter: any;
            static defaultMaxListeners: any;
            static init(): void;
            static listenerCount(emitter: any, type: any): any;
            static usingDomains: boolean;
            addListener(type: any, listener: any): any;
            emit(type: any, args: any): any;
            eventNames(): any;
            getMaxListeners(): any;
            listenerCount(type: any): any;
            listeners(type: any): any;
            off(type: any, listener: any): any;
            on(type: any, listener: any): any;
            once(type: any, listener: any): any;
            prependListener(type: any, listener: any): any;
            prependOnceListener(type: any, listener: any): any;
            rawListeners(type: any): any;
            removeAllListeners(type: any, ...args: any[]): any;
            removeListener(type: any, listener: any): any;
            setMaxListeners(n: any): any;
        }
    }
}
export class WriteEntry {
    static defaultMaxListeners: any;
    static init(): void;
    static listenerCount(emitter: any, type: any): any;
    static usingDomains: boolean;
    addListener(ev: any, fn: any): any;
    collect(): any;
    emit(ev: any, data: any, ...args: any[]): any;
    end(chunk: any, encoding: any, cb: any): void;
    eventNames(): any;
    getMaxListeners(): any;
    listenerCount(type: any): any;
    listeners(type: any): any;
    off(type: any, listener: any): any;
    on(ev: any, fn: any): any;
    once(type: any, listener: any): any;
    pause(): void;
    pipe(dest: any, opts: any): any;
    prependListener(type: any, listener: any): any;
    prependOnceListener(type: any, listener: any): any;
    rawListeners(type: any): any;
    read(n: any): any;
    removeAllListeners(type: any, ...args: any[]): any;
    removeListener(type: any, listener: any): any;
    resume(): any;
    setEncoding(enc: any): void;
    setMaxListeners(n: any): any;
    warn(msg: any, data: any): void;
    write(chunk: any, encoding: any, cb: any): any;
}
export namespace WriteEntry {
    class EventEmitter {
        // Circular reference from index.WriteEntry.EventEmitter
        static EventEmitter: any;
        static defaultMaxListeners: any;
        static init(): void;
        static listenerCount(emitter: any, type: any): any;
        static usingDomains: boolean;
        addListener(type: any, listener: any): any;
        emit(type: any, args: any): any;
        eventNames(): any;
        getMaxListeners(): any;
        listenerCount(type: any): any;
        listeners(type: any): any;
        off(type: any, listener: any): any;
        on(type: any, listener: any): any;
        once(type: any, listener: any): any;
        prependListener(type: any, listener: any): any;
        prependOnceListener(type: any, listener: any): any;
        rawListeners(type: any): any;
        removeAllListeners(type: any, ...args: any[]): any;
        removeListener(type: any, listener: any): any;
        setMaxListeners(n: any): any;
    }
    class Sync {
        // Circular reference from index.WriteEntry.Sync
        static Sync: any;
        static defaultMaxListeners: any;
        static init(): void;
        static listenerCount(emitter: any, type: any): any;
        static usingDomains: boolean;
        constructor(path: any, opt: any);
        addListener(ev: any, fn: any): any;
        collect(): any;
        emit(ev: any, data: any, ...args: any[]): any;
        end(chunk: any, encoding: any, cb: any): void;
        eventNames(): any;
        getMaxListeners(): any;
        listenerCount(type: any): any;
        listeners(type: any): any;
        off(type: any, listener: any): any;
        on(ev: any, fn: any): any;
        once(type: any, listener: any): any;
        pause(): void;
        pipe(dest: any, opts: any): any;
        prependListener(type: any, listener: any): any;
        prependOnceListener(type: any, listener: any): any;
        rawListeners(type: any): any;
        read(n: any): any;
        removeAllListeners(type: any, ...args: any[]): any;
        removeListener(type: any, listener: any): any;
        resume(): any;
        setEncoding(enc: any): void;
        setMaxListeners(n: any): any;
        warn(msg: any, data: any): void;
        write(chunk: any, encoding: any, cb: any): any;
    }
    namespace Sync {
        class EventEmitter {
            // Circular reference from index.WriteEntry.Sync.EventEmitter
            static EventEmitter: any;
            static defaultMaxListeners: any;
            static init(): void;
            static listenerCount(emitter: any, type: any): any;
            static usingDomains: boolean;
            addListener(type: any, listener: any): any;
            emit(type: any, args: any): any;
            eventNames(): any;
            getMaxListeners(): any;
            listenerCount(type: any): any;
            listeners(type: any): any;
            off(type: any, listener: any): any;
            on(type: any, listener: any): any;
            once(type: any, listener: any): any;
            prependListener(type: any, listener: any): any;
            prependOnceListener(type: any, listener: any): any;
            rawListeners(type: any): any;
            removeAllListeners(type: any, ...args: any[]): any;
            removeListener(type: any, listener: any): any;
            setMaxListeners(n: any): any;
        }
        class Tar {
            static defaultMaxListeners: any;
            static init(): void;
            static listenerCount(emitter: any, type: any): any;
            static usingDomains: boolean;
            addListener(ev: any, fn: any): any;
            collect(): any;
            emit(ev: any, data: any, ...args: any[]): any;
            end(): any;
            eventNames(): any;
            getMaxListeners(): any;
            listenerCount(type: any): any;
            listeners(type: any): any;
            off(type: any, listener: any): any;
            on(ev: any, fn: any): any;
            once(type: any, listener: any): any;
            pause(): void;
            pipe(dest: any, opts: any): any;
            prependListener(type: any, listener: any): any;
            prependOnceListener(type: any, listener: any): any;
            rawListeners(type: any): any;
            read(n: any): any;
            removeAllListeners(type: any, ...args: any[]): any;
            removeListener(type: any, listener: any): any;
            resume(): any;
            setEncoding(enc: any): void;
            setMaxListeners(n: any): any;
            warn(msg: any, data: any): void;
            write(data: any): any;
        }
        namespace Tar {
            function EventEmitter(): void;
            namespace EventEmitter {
                // Circular reference from index.WriteEntry.Sync.Tar.EventEmitter
                const EventEmitter: any;
                // Too-deep object hierarchy from index.WriteEntry.Sync.Tar.EventEmitter
                const defaultMaxListeners: any;
                // Too-deep object hierarchy from index.WriteEntry.Sync.Tar.EventEmitter
                const init: any;
                // Too-deep object hierarchy from index.WriteEntry.Sync.Tar.EventEmitter
                const listenerCount: any;
                // Too-deep object hierarchy from index.WriteEntry.Sync.Tar.EventEmitter
                const usingDomains: any;
            }
        }
    }
    class Tar {
        static defaultMaxListeners: any;
        static init(): void;
        static listenerCount(emitter: any, type: any): any;
        static usingDomains: boolean;
        addListener(ev: any, fn: any): any;
        collect(): any;
        emit(ev: any, data: any, ...args: any[]): any;
        end(): any;
        eventNames(): any;
        getMaxListeners(): any;
        listenerCount(type: any): any;
        listeners(type: any): any;
        off(type: any, listener: any): any;
        on(ev: any, fn: any): any;
        once(type: any, listener: any): any;
        pause(): void;
        pipe(dest: any, opts: any): any;
        prependListener(type: any, listener: any): any;
        prependOnceListener(type: any, listener: any): any;
        rawListeners(type: any): any;
        read(n: any): any;
        removeAllListeners(type: any, ...args: any[]): any;
        removeListener(type: any, listener: any): any;
        resume(): any;
        setEncoding(enc: any): void;
        setMaxListeners(n: any): any;
        warn(msg: any, data: any): void;
        write(data: any): any;
    }
    namespace Tar {
        class EventEmitter {
            // Circular reference from index.WriteEntry.Tar.EventEmitter
            static EventEmitter: any;
            static defaultMaxListeners: any;
            static init(): void;
            static listenerCount(emitter: any, type: any): any;
            static usingDomains: boolean;
            addListener(type: any, listener: any): any;
            emit(type: any, args: any): any;
            eventNames(): any;
            getMaxListeners(): any;
            listenerCount(type: any): any;
            listeners(type: any): any;
            off(type: any, listener: any): any;
            on(type: any, listener: any): any;
            once(type: any, listener: any): any;
            prependListener(type: any, listener: any): any;
            prependOnceListener(type: any, listener: any): any;
            rawListeners(type: any): any;
            removeAllListeners(type: any, ...args: any[]): any;
            removeListener(type: any, listener: any): any;
            setMaxListeners(n: any): any;
        }
    }
}
export function c(opt_: any, files: any, cb: any): any;
export function create(opt_: any, files: any, cb: any): any;
export function extract(opt_: any, files: any, cb: any): any;
export function list(opt_: any, files: any, cb: any): any;
export function r(opt_: any, files: any, cb: any): any;
export function replace(opt_: any, files: any, cb: any): any;
export function t(opt_: any, files: any, cb: any): any;
export function u(opt_: any, files: any, cb: any): any;
export function update(opt_: any, files: any, cb: any): any;
export function x(opt_: any, files: any, cb: any): any;
