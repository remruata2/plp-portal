const mockSession = {
  data: {
    user: {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'ADMIN',
    },
    expires: '2024-01-01T00:00:00.000Z',
  },
  status: 'authenticated',
  update: jest.fn().mockResolvedValue({
    user: {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'ADMIN',
    },
    expires: '2024-01-01T00:00:00.000Z',
  }),
};

const useSession = jest.fn(() => ({
  data: null,
  status: 'unauthenticated',
  update: mockSession.update,
}));

const signIn = jest.fn();
const signOut = jest.fn();
const getSession = jest.fn();
const getCsrfToken = jest.fn();
const getProviders = jest.fn();

module.exports = {
  useSession,
  signIn,
  signOut,
  getSession,
  getCsrfToken,
  getProviders,
  // Export mocks for assertions
  mockSession,
  mockUseSession: useSession,
};
