import { Metadata, MetadataKey, SerializationProp, SerIDKey, EntityID, MetadataEntry } from './types';
import * as crypto from 'crypto';
import { inspect } from 'util';

export class Reflector {
    private static _instance: Reflector | null = null;

    private readonly _metadata: Metadata;

    private constructor() {
        this._metadata = new Map<EntityID, MetadataEntry>();
    }

    static getInstance(): Reflector {
        if (!Reflector._instance) {
            Reflector._instance = new Reflector();
        }
        return Reflector._instance;
    }

    static extractID(target: any): string | null {
        return target[SerIDKey];
    }

    pushMeta(target: any, key: MetadataKey, prop: SerializationProp): void {
        let id = Reflector.extractID(target);

        if (!id) {
            id = Reflector._generateUUID();
            Reflector._setID(target, id);
            this._createEntry(id);
        }

        this.getProps(id, key).push(prop);
    }

    getMeta(target: any, key: MetadataKey): SerializationProp[] {
        const id = Reflector.extractID(target);

        if (!id) {
            return [];
        }

        return this.getProps(id, key);
    }

    getProps(id: EntityID, key: MetadataKey): SerializationProp[] {
        return this._metadata.get(id)?.[key] ?? [];
    }

    trackTarget(target: any): EntityID {
        let id = Reflector.extractID(target);

        if (!id) {
            id = Reflector._generateUUID();
            Reflector._setID(target, id);
        }

        if (!this._metadata.has(id)) {
            this._createEntry(id);
        }

        return id;
    }

    printMeta() {
        const entries = [...this._metadata.entries()];
        for (const entry of entries) {
            console.log(inspect(entry, true, null, true));
        }
    }

    private static _setID(target: any, id: string): void {
        Object.defineProperty(target, SerIDKey, { value: id });
    }

    private static _generateUUID(): EntityID {
        return crypto.randomUUID();
    }

    private _createEntry(id: EntityID): void {
        if (this._metadata.has(id)) {
            return;
        }

        this._metadata.set(id, {
            ser_props: [],
            deser_props: [],
        });
    }
}
