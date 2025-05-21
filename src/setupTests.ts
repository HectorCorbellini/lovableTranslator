import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('@xenova/transformers', () => ({
  pipeline: vi.fn().mockResolvedValue(async (_input: string, _opts: any) => [{ translation_text: '' }]),
  env: {
    allowLocalModels: false,
    useBrowserCache: false,
    HF_TOKEN: '',
  },
}));
