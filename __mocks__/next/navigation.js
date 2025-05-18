const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockPrefetch = jest.fn();
const mockBack = jest.fn();
const mockForward = jest.fn();
const mockRefresh = jest.fn();

const useRouter = () => ({
  push: mockPush,
  replace: mockReplace,
  prefetch: mockPrefetch,
  back: mockBack,
  forward: mockForward,
  refresh: mockRefresh,
});

const usePathname = jest.fn(() => '/');
const useSearchParams = jest.fn(() => ({
  get: jest.fn(),
  toString: jest.fn(),
}));

module.exports = {
  useRouter,
  usePathname,
  useSearchParams,
  // Export mocks for assertions
  mockPush,
  mockReplace,
  mockPrefetch,
  mockBack,
  mockForward,
  mockRefresh,
};
