import React from 'react';
import { render, screen } from '@testing-library/react';
import { TranslationProvider } from '@/context/TranslationContext';
import { SourceTextArea } from '@/components/SourceTextArea';
import { UI_STRINGS } from '@/lib/strings';

test('SourceTextArea placeholder matches default en-to-es', () => {
  render(
    <TranslationProvider>
      <SourceTextArea />
    </TranslationProvider>
  );
  const textarea = screen.getByRole('textbox');
  expect(textarea).toHaveAttribute('placeholder', UI_STRINGS.placeholders.enToEs);
});
