import {
    SerializationProp,
    SimpleSerializationProp,
    SerializationPropType,
    ComplexSerializationProp,
    ListSerializationProp,
    SimpleListSerializationProp,
    ComplexListSerializationProp,
} from './types';

export function isSimple(prop: SerializationProp): prop is SimpleSerializationProp {
    const type = getType(prop);
    return type !== null && type === SerializationPropType.SIMPLE;
}

export function isComplex(prop: SerializationProp): prop is ComplexSerializationProp {
    const type = getType(prop);
    return type !== null && type === SerializationPropType.COMPLEX;
}

export function isList(prop: SerializationProp): prop is ListSerializationProp {
    const type = getType(prop);
    return type !== null && type === SerializationPropType.LIST;
}

export function isSimpleList(prop: SerializationProp): prop is SimpleListSerializationProp {
    return isList(prop) && (prop as any).listType === SerializationPropType.SIMPLE;
}

export function isComplexList(prop: SerializationProp): prop is ComplexListSerializationProp {
    return isList(prop) && typeof (prop as any).listType === 'string';
}

function getType(prop: SerializationProp): SerializationPropType | null {
    const type = prop.type;

    if (type === null || type === undefined) {
        return null;
    }

    return type;
}
