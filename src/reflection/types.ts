export const SerIDKey = 'ser_id';

const METADATA_KEYS = ['ser_props', 'deser_props'] as const;

export type EntityID = string;

export type Metadata = Map<EntityID, MetadataEntry>;

export type MetadataKey = typeof METADATA_KEYS[number];

export type MetadataEntry = {
    [k in MetadataKey]: SerializationProp[];
}

export interface SerializationProp {
    value: string;
    type: SerializationPropType;
}

export interface SimpleSerializationProp extends SerializationProp {
    type: SerializationPropType.SIMPLE;
}

export interface ComplexSerializationProp extends SerializationProp {
    type: SerializationPropType.COMPLEX;
    ref: EntityID;
    proto: new (...args: any[]) => any;
}

export interface ListSerializationProp extends SerializationProp {
    type: SerializationPropType.LIST;
}

export interface SimpleListSerializationProp extends ListSerializationProp {
    listType: SerializationPropType.SIMPLE;
}

export interface ComplexListSerializationProp extends ListSerializationProp {
    listType: EntityID;
    proto: new (...args: any[]) => any;
}

export enum SerializationPropType {
    UNKNOWN,
    SIMPLE,
    COMPLEX,
    LIST
}
