import { Serialize, Deserialize, DeserializeArray, DeserializeAs } from '../src';

export class TestClass {
    @Serialize() @Deserialize() message: string;
    @Serialize() @Deserialize() answer = 42;
    @Deserialize() secretPassword = 'password';

    fn() {
        return 'simple';
    }
}

export class ComplexTestClass {
    @Serialize() @DeserializeAs(TestClass) singleTest: TestClass;
    @Serialize() @DeserializeArray(TestClass) tests: TestClass[];
    @Serialize() numbers: number[];
    @DeserializeArray() strings: string[];

    fn() {
        return 'complex';
    }
}

export const testObj = {
    singleTest: {
        message: 'Hello world',
        answer: 420,
    },
    tests: [{ message: 'one', answer: 200 }, { message: 'two' }],
    numbers: [100, 200, 300, 400],
    strings: ['abc', 'def', 'ghi'],
};
