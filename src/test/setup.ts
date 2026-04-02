/*Jonathan Torres wrote all 2 lines of code for this file*/
/// <reference types="vitest/globals" />
import '@testing-library/jest-dom';

// Mock image imports (figma assets, etc.)
vi.mock('figma:asset/1a36a3a0f13bed42158cef736e0c5fd1e80a9a0c.png', () => ({
  default: 'mock-logo.png',
}));
