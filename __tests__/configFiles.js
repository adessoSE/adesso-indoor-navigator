import * as realConfig from '../config';
import * as configTemplate from '../configTemplate';

const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.%]+$/;

const executeTestsFor = (config) => {
    it('Should contain a viro API key', () => {
        expect(config).toHaveProperty('viroApiKey');
    });

    it('Should contain a firebase API key', () => {
        expect(config).toHaveProperty('firebaseApiKey');
    });

    it('Should have a property named apiKeys', () => {
        expect(config).toHaveProperty('apiKeys');
    });

    it('Should have a default export', () => {
        expect(config).toHaveProperty('default');
    });

    describe('apiKeys', () => {
        let apiKeys;

        beforeAll(() => {
            apiKeys = config.apiKeys;
        });

        it('Should have a property named viro that is equal to the viroApiKey', () => {
            expect(apiKeys).toHaveProperty('viro');
            expect(apiKeys.viro).toBe(config.viroApiKey);
        });

        it('Should have a property named firebase that is equal to the firebaseApiKey', () => {
            expect(apiKeys).toHaveProperty('firebase');
            expect(apiKeys.firebase).toBe(config.firebaseApiKey);
        });
    });

    describe('default', () => {
        let defaultObj;

        beforeAll(() => {
            defaultObj = config.default;
        });

        it('Should have a property named viro', () => {
            expect(defaultObj).toHaveProperty('viro');
        });

        describe('viro', () => {
            it('Should have a property named apiKey that is equal to viroApiKey', () => {
                expect(defaultObj.viro).toHaveProperty('apiKey');
                expect(defaultObj.viro.apiKey).toBe(config.viroApiKey);
            });

            it('Should have a property named featuresMap that should be a URL', () => {
                expect(defaultObj.viro).toHaveProperty('featuresMap');
                expect(defaultObj.viro.featuresMap).toMatch(urlRegex);
            });
        });

        it('Should have a property named firebase', () => {
            expect(defaultObj).toHaveProperty('firebase');
        });

        describe('firebase', () => {
            it('Should have a property named apiKey that is equal to firebaseApiKey', () => {
                expect(defaultObj.firebase).toHaveProperty('apiKey');
                expect(defaultObj.firebase.apiKey).toBe(config.firebaseApiKey);
            });

            it('Should have a property named messagingSenderId that is a string that only contains digits', () => {
                expect(defaultObj.firebase).toHaveProperty('messagingSenderId');
                expect(typeof defaultObj.firebase.messagingSenderId).toBe('string');
                expect(defaultObj.firebase.messagingSenderId).toMatch(/^\d+$/gm);
            });

            it('Should have a property named authDomain that should be a URL', () => {
                expect(defaultObj.firebase).toHaveProperty('authDomain');
                expect(defaultObj.firebase.databaseURL).toMatch(urlRegex);
            });

            it('Should have a property named databaseURL that should be a URL', () => {
                expect(defaultObj.firebase).toHaveProperty('databaseURL');
                expect(defaultObj.firebase.databaseURL).toMatch(urlRegex);
            });

            it('Should have a property named projectId that is a string', () => {
                expect(defaultObj.firebase).toHaveProperty('projectId');
                expect(typeof defaultObj.firebase.projectId).toBe('string');
            });

            it('Should have a property named storageBucket that is a string', () => {
                expect(defaultObj.firebase).toHaveProperty('storageBucket');
                expect(typeof defaultObj.firebase.storageBucket).toBe('string');
            });

            it('Should have a property named emailInputErrorMessage that is a string', () => {
                expect(defaultObj.firebase).toHaveProperty('emailInputErrorMessage');
                expect(typeof defaultObj.firebase.emailInputErrorMessage).toBe('string');
            });
        });
    });
};

describe('config', () => executeTestsFor(realConfig));
describe('configTemplate', () => executeTestsFor(configTemplate));