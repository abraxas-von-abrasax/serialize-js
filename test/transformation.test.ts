import { transform, Serialize } from '../src';

class TestClass {
    @Serialize() message: string;
    @Serialize() answer = 42;
    secretPassword = 'password';
}

class ComplexTestClass {
    @Serialize() singleTest: TestClass;
    @Serialize() tests: TestClass[];
    @Serialize() numbers: number[];
}

describe('Transformation tests', () => {
    it('class-instances should look as expected after member decoration', () => {
        const instance = new TestClass();
        expect(instance).toBeInstanceOf(TestClass);
        expect(instance.message).toBeUndefined();
        expect(typeof instance.answer).toBe('number');
        expect(instance.answer).toBe(42);
        expect(instance.secretPassword).toBe('password');
    });

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
});
