import { describe, expect, it, vi, beforeEach } from 'vitest';

// Mock the worker
const mockPostMessage = vi.fn();

// Mock the pipeline function with failure and retry
vi.mock('@xenova/transformers', () => {
  let callCount = 0;
  return {
    pipeline: vi.fn().mockImplementation(() => ({
      __call: async function(text: string) {
        // Fail on first attempt, succeed on retry
        callCount++;
        if (callCount === 1) {
          throw new Error('Translation failed');
        }
        return [{ translation_text: `Translated after retry: ${text}` }];
      }
    })),
    env: {
      allowLocalModels: false,
      useBrowserCache: true,
      HF_TOKEN: 'mock-token'
    }
  };
});

describe('Translation Retry Mechanism', () => {
  // Import the worker code to test
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

  it('should retry failed translations up to MAX_CHUNK_RETRIES times', async () => {
    // Send a translation request
    const message = new MessageEvent('message', {
      data: { sourceText: 'Test retry', direction: 'en-to-es' }
    });
    
    await onMessageCallback(message);
    
    // Check that we got a successful result after retry
    const resultCalls = mockPostMessage.mock.calls.filter(
      call => call[0].type === 'result'
    );
    
    // Should have one result call
    expect(resultCalls.length).toBe(1);
    expect(resultCalls[0][0].result).toContain('Translated after retry');
    
    // Should not have error messages
    const errorCalls = mockPostMessage.mock.calls.filter(
      call => call[0].type === 'error'
    );
    expect(errorCalls.length).toBe(0);
  });
});
