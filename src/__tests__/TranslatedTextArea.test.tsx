import { describe, expect, it, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

const mockUseTranslation = {
  translatedText: '',
  isTranslating: false,
  copyToClipboard: vi.fn(),
  isCopied: false,
};
vi.mock('../context/TranslationContext', () => ({
  useTranslation: () => mockUseTranslation,
}));

import TranslatedTextArea from '../components/TranslatedTextArea';
import { UI_STRINGS } from '../lib/strings';

describe('TranslatedTextArea', () => {
  beforeEach(() => {
    mockUseTranslation.translatedText = '';
    mockUseTranslation.isTranslating = false;
    mockUseTranslation.copyToClipboard = vi.fn();
    mockUseTranslation.isCopied = false;
  });

  it('should display placeholder when no translated text is available', () => {
    render(<TranslatedTextArea />);
    
    const textArea = screen.getByRole('textbox');
    expect(textArea).toHaveValue('');
    expect(textArea).toHaveAttribute('placeholder', UI_STRINGS.placeholders.translationArea);
  });

  it('should display translated text when available', () => {
    const translatedText = 'Hola mundo';
    mockUseTranslation.translatedText = translatedText;
    render(<TranslatedTextArea />);
    
    const textArea = screen.getByRole('textbox');
    expect(textArea).toHaveValue(translatedText);
  });

  it('should have proper accessibility attributes', () => {
    render(<TranslatedTextArea />);
    
    const textArea = screen.getByRole('textbox');
    expect(textArea).toHaveAttribute('aria-label', 'Translation result');
    expect(textArea).toHaveAttribute('aria-live', 'polite');
  });
});
