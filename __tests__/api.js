import api from '../js/api';

describe('Api', () => {
    let consoleError;

    // eslint-disable-next-line max-len
    const fetchUrl = 'https://gist.githubusercontent.com/parideis/3c983c92e3a56e90af700e32709d5329/raw/729da2e5a3e91d4169c2abe0f03306d31bbf73b5/position.json';
    const jsonResult = {
        foo: 'bar',
        someObj: {
            fruits: ['apple', 'orange']
        }
    };

    beforeEach(() => {
        global.fetch = jest.fn().mockResolvedValue({
            foo: 'bar',
            json: () => jsonResult
        });

        consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleError.mockRestore();
    });

    it('Should be an object with a getPOI property', () => {
        expect(api).toBeInstanceOf(Object);
        expect(api.getPOI).toBeDefined();
    });

    it('Should call fetch with a specific URL', async () => {
        await api.getPOI();
        expect(fetch.mock.calls.length).toBe(1);
        expect(fetch.mock.calls[0]).toStrictEqual([fetchUrl]);
    });

    it('Should return the result of the json property of the response if it has one', async () => {
        await expect(api.getPOI()).resolves.toStrictEqual(jsonResult);
    });

    it('Should resolve with undefined if fetch fails', async () => {
        fetch.mockRejectedValue(new Error());

        await expect(api.getPOI()).resolves.toBeUndefined();
    });

    it('Should log any error thrown by fetch if it fails', async () => {
        const error = new Error('Cool error!');
        fetch.mockRejectedValue(error);

        await api.getPOI();

        expect(consoleError.mock.calls.length).toBe(1);
        expect(consoleError.mock.calls[0]).toStrictEqual([error]);
    });
});