import { METADATA_KEY, SerializableFields } from './util';

export class Reflector {
    private static _instance: Reflector | null = null;

    private constructor() {}

    static getInstance(): Reflector {
        if (!Reflector._instance) {
            Reflector._instance = new Reflector();
        }
        return Reflector._instance;
    }

    getMetadata(target: any): SerializableFields | null {
        return target[METADATA_KEY] ?? null;
    }

    setMetadata(target: any, metadata: SerializableFields): void {
        Object.defineProperty(target, METADATA_KEY, { value: metadata });
    }
}
