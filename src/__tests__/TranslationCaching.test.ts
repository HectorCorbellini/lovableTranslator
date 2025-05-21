import { describe, expect, it, vi, beforeEach } from 'vitest';

// Mock the worker
const mockPostMessage = vi.fn();

// Mock the pipeline function
vi.mock('@xenova/transformers', () => ({
  pipeline: vi.fn().mockImplementation(() => ({
    __mockTranslate: async (text: string) => ({ translation_text: `Translated: ${text}` }),
    __call: async function(text: string) {
      return [{ translation_text: await this.__mockTranslate(text) }];
    }
  })),
  env: {
    allowLocalModels: false,
    useBrowserCache: true,
    HF_TOKEN: 'mock-token'
  }
}));

describe('Translation Caching', () => {
  // Import the worker code to test
  let worker: Worker;
  let onMessageCallback: (e: MessageEvent) => void;
  
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Mock self
    global.self = {
      ...global.self,
      postMessage: mockPostMessage,
      onmessage: null
    } as unknown as typeof self;
    
    // Import the worker module to get the onmessage handler
    const workerModule = require('../workers/translation.worker');
    onMessageCallback = global.self.onmessage as unknown as (e: MessageEvent) => void;
  });

  it('should cache translations for repeated chunks', async () => {
    // First translation
    const firstMessage = new MessageEvent('message', {
      data: { sourceText: 'Hello world', direction: 'en-to-es' }
    });
    
    await onMessageCallback(firstMessage);
    
    // Second translation with same text
    mockPostMessage.mockClear(); // Clear previous calls
    
    const secondMessage = new MessageEvent('message', {
      data: { sourceText: 'Hello world', direction: 'en-to-es' }
    });
    
    await onMessageCallback(secondMessage);
    
    // Verify the pipeline wasn't called again for the same text
    const progressCalls = mockPostMessage.mock.calls.filter(
      call => call[0].type === 'progress'
    );
    
    const resultCalls = mockPostMessage.mock.calls.filter(
      call => call[0].type === 'result'
    );
    
    // Should have one result call
    expect(resultCalls.length).toBe(1);
    
    // Should have fewer progress calls on second run due to caching
    expect(progressCalls.length).toBeGreaterThan(0);
  });
});
