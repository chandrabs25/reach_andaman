import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = jest.fn();

// Mock window.alert
global.alert = jest.fn();

// Mock Razorpay
global.Razorpay = jest.fn().mockImplementation(() => ({
  on: jest.fn(),
  open: jest.fn(),
}));

// Mock next/script
jest.mock('next/script', () => ({
  __esModule: true,
  default: ({ onLoad, children }) => {
    if (onLoad) setTimeout(onLoad, 0);
    return <script>{children}</script>;
  },
}));

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
