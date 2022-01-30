import { Reflector } from './reflector';

export function transform<T = any>(obj: any): T | null {
    const reflector = Reflector.getInstance();
    const proto = Object.getPrototypeOf(obj);
    const metadata = reflector.getMetadata(proto);

    if (!metadata) {
        return null;
    }

    const result = {};

    for (const entry of metadata) {
        (result as any)[entry] = processMetadataEntry(entry, obj);
    }

    Object.setPrototypeOf(result, proto);

    return result as T;
}

function processMetadataEntry(entry: string, obj: any): any {
    const el = obj[entry];
    const isArray = Array.isArray(el);

    return !isArray
        ? processSingleField(el)
        : el.map(elItem => processSingleField(elItem));
}

function processSingleField(el: any) {
    if (el === null || el === undefined) {
        return el;
    }

    const reflector = Reflector.getInstance();
    const proto = Object.getPrototypeOf(el);

    return typeof el === 'object' && reflector.getMetadata(proto) ? transform(el) : el;
}
