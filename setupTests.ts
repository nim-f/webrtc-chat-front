import fetchMock, { FetchMock } from "jest-fetch-mock";

global.fetch = fetchMock as FetchMock;

const mockGetUserMedia = jest.fn(async () => {
    return new Promise<void>((resolve) => {
        resolve();
    });
});

Object.defineProperty(global.navigator, "mediaDevices", {
    value: {
        getUserMedia: mockGetUserMedia,
    },
});
