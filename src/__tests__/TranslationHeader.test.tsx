import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TranslationProvider } from '@/context/TranslationContext';
import { TranslationHeader } from '@/components/TranslationHeader';
import { UI_STRINGS } from '@/lib/strings';

describe('TranslationHeader', () => {
  test('displays correct text and toggles on swap', async () => {
    render(
      <TranslationProvider>
        <TranslationHeader />
      </TranslationProvider>
    );

    // initial direction en-to-es
    expect(screen.getByText(UI_STRINGS.header.enToEs)).toBeInTheDocument();

    // click swap button
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText(UI_STRINGS.header.esToEn)).toBeInTheDocument();
  });
});
