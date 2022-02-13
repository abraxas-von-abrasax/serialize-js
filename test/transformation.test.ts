import { transform, Serialize, deserialize, Deserialize } from '../src';
import { TestClass, ComplexTestClass, testObj } from './test-data';

describe('Transformation tests', () => {
    it('should transform only decorated values', () => {
        const instance = new TestClass();
        instance.message = 'Hello world';
        const serialized = transform(instance);
        expect(serialized).toBeInstanceOf(TestClass);
        expect(serialized.message).toBe('Hello world');
        expect(typeof serialized.answer).toBe('number');
        expect(serialized.answer).toBe(42);
        expect(serialized.secretPassword).toBeUndefined();
    });

    it('should transform objects with arrays correctly', () => {
        const singleTest = new TestClass();
        singleTest.message = 'Hello single';

        const test1 = new TestClass();
        test1.message = 'Hello world';

        const test2 = new TestClass();
        test2.message = 'Hi world';

        const numbers = [100, 200, 300];

        const complex = new ComplexTestClass();
        complex.singleTest = singleTest;
        complex.tests = [test1, test2];
        complex.numbers = numbers;
        const serialized = transform(complex);

        expect(serialized).toBeInstanceOf(ComplexTestClass);
        expect(serialized.singleTest).toBeInstanceOf(TestClass);
        expect(serialized.tests).toBeInstanceOf(Array);

        expect(serialized.numbers).toBeInstanceOf(Array);
        expect(serialized.numbers.length).toBe(3);
        expect(serialized.numbers).toStrictEqual([100, 200, 300]);

        const serializedSingleTest = serialized.singleTest;
        const serializedTest1 = serialized.tests[0];
        const serializedTest2 = serialized.tests[1];

        expect(serializedSingleTest.message).toBe('Hello single');
        expect(typeof serializedSingleTest.answer).toBe('number');
        expect(serializedSingleTest.answer).toBe(42);
        expect(serializedSingleTest.secretPassword).toBeUndefined();

        expect(serializedTest1).toBeInstanceOf(TestClass);
        expect(serializedTest1.message).toBe('Hello world');
        expect(typeof serializedTest1.answer).toBe('number');
        expect(serializedTest1.answer).toBe(42);
        expect(serializedTest1.secretPassword).toBeUndefined();

        expect(serializedTest2).toBeInstanceOf(TestClass);
        expect(serializedTest2.message).toBe('Hi world');
        expect(typeof serializedTest2.answer).toBe('number');
        expect(serializedTest2.answer).toBe(42);
        expect(serializedTest2.secretPassword).toBeUndefined();
    });

    it('should return null for not transformable objects', () => {
        class Empty {}

        const instance = new Empty();
        const serialized = transform(instance);
        expect(serialized).toBe(null);
    });

    it('should transform null values correctly', () => {
        class Test {
            @Serialize()
            test = 42;
            @Serialize()
            nullVal = null;
        }

        const instance = new Test();
        const serialized = transform(instance);
        expect(serialized.test).toBe(42);
        expect(serialized.nullVal).toBe(null);
    });

    it('should create class-objects correctly', () => {
        const defaultSingleTest = new TestClass();

        const obj = deserialize<ComplexTestClass>(testObj, ComplexTestClass);

        expect(obj).toBeInstanceOf(ComplexTestClass);
        expect(obj.fn()).toBe('complex');

        const singleTest = obj.singleTest;
        expect(singleTest).toBeInstanceOf(TestClass);
        expect(singleTest.message).toBe('Hello world');
        expect(singleTest.answer).toBe(420);
        expect(singleTest.secretPassword).toBe(defaultSingleTest.secretPassword);
        expect(singleTest.fn()).toBe('simple');

        expect(obj.tests).toHaveLength(2);
        for (const test of obj.tests) {
            expect(test).toBeInstanceOf(TestClass);
            expect(test.fn()).toBe('simple');
            expect(test.secretPassword).toBe(defaultSingleTest.secretPassword);
        }
        expect(obj.tests[0].message).toBe('one');
        expect(obj.tests[0].answer).toBe(200);
        expect(obj.tests[1].message).toBe('two');
        expect(obj.tests[1].answer).toBe(defaultSingleTest.answer);

        expect(obj.numbers).toBeUndefined();

        expect(obj.strings).toHaveLength(3);
        for (const str of obj.strings) {
            expect(typeof str).toBe('string');
        }
        expect(obj.strings[0]).toBe('abc');
        expect(obj.strings[1]).toBe('def');
        expect(obj.strings[2]).toBe('ghi');
    });

    it('should cope with null object passed in as blueprint', () => {
        const test = {
            answer: 42,
        };

        class Test {
            @Deserialize() answer: number;
        }

        const undefRes = deserialize(test, { prototype: null } as any);
        expect(undefRes).toBeUndefined();

        const compareRes = deserialize<Test>(test, Test);
        expect(compareRes).toBeInstanceOf(Test);
        expect(compareRes.answer).toBe(42);
    });
});
