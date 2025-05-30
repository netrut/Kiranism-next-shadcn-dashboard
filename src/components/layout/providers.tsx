'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import React from 'react';
import { ActiveThemeProvider } from '../active-theme';

export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <ActiveThemeProvider initialTheme={activeThemeValue}>
        <ClerkProvider
          appearance={{
            baseTheme: activeThemeValue === 'dark' ? dark : undefined,
            elements: {
              formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
              card: 'bg-background',
              headerTitle: 'text-foreground',
              headerSubtitle: 'text-muted-foreground',
              socialButtonsBlockButton: 'bg-background border-border hover:bg-muted',
              socialButtonsBlockButtonText: 'text-foreground',
              formFieldInput: 'bg-background',
              formFieldLabel: 'text-foreground',
              footerActionLink: 'text-primary hover:text-primary/90',
              formFieldLabelRow: 'text-muted-foreground'
            },
            signIn: {
              terms: 'Your terms of service and privacy policy'
            }
          }}
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
          {children}
        </ClerkProvider>
      </ActiveThemeProvider>
    </NextThemesProvider>
  );
}
