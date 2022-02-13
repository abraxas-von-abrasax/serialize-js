import {
    SerializationPropType,
    ComplexSerializationProp,
    ListSerializationProp,
    SimpleListSerializationProp,
    ComplexListSerializationProp,
    SimpleSerializationProp,
} from '../src/reflection/types';
import { isComplex, isList, isSimpleList, isComplexList } from '../src/reflection/util';

class Test {}

const propSimple: SimpleSerializationProp = {
    type: SerializationPropType.SIMPLE,
    value: 'test',
};

const propComplex: ComplexSerializationProp = {
    type: SerializationPropType.COMPLEX,
    value: 'test',
    ref: 'test',
    proto: Test,
};

const propList: ListSerializationProp = {
    type: SerializationPropType.LIST,
    value: 'test',
};

const propSimpleList: SimpleListSerializationProp = {
    type: SerializationPropType.LIST,
    value: 'test',
    listType: SerializationPropType.SIMPLE,
};

const propComplexList: ComplexListSerializationProp = {
    type: SerializationPropType.LIST,
    value: 'test',
    proto: Test,
    listType: 'test',
};

describe('Util tests', () => {
    it('should identify complex serialization props correctly', () => {
        expect(isComplex(propComplex)).toBe(true);

        expect(isComplex(propSimple)).toBe(false);
        expect(isComplex(propList)).toBe(false);
        expect(isComplex(propSimpleList)).toBe(false);
        expect(isComplex(propComplexList)).toBe(false);
    });

    it('should identify list serialization props correctly', () => {
        expect(isList(propList)).toBe(true);
        expect(isList(propSimpleList)).toBe(true);
        expect(isList(propComplexList)).toBe(true);

        expect(isList(propSimple)).toBe(false);
        expect(isList(propComplex)).toBe(false);
    });

    it('should identify simple list serialization props correctly', () => {
        expect(isSimpleList(propSimpleList)).toBe(true);

        expect(isSimpleList(propSimple)).toBe(false);
        expect(isSimpleList(propComplex)).toBe(false);
        expect(isSimpleList(propList)).toBe(false);
        expect(isSimpleList(propComplexList)).toBe(false);
    });

    it('should identify complex list serialization props correctly', () => {
        expect(isComplexList(propComplexList)).toBe(true);

        expect(isComplexList(propSimple)).toBe(false);
        expect(isComplexList(propComplex)).toBe(false);
        expect(isComplexList(propList)).toBe(false);
        expect(isComplexList(propSimpleList)).toBe(false);
    });

    it('should correctly reject unknown types', () => {
        expect(isComplex(42 as any)).toBe(false);
        expect(isList(42 as any)).toBe(false);
        expect(isSimpleList(42 as any)).toBe(false);
        expect(isComplexList(42 as any)).toBe(false);
    });
});
