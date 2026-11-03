'use client';

import { PropsWithChildren } from 'react';
import { CookiesProvider } from 'react-cookie';

const CookieContext: React.FC<PropsWithChildren> = ({ children }) => (
  <CookiesProvider>{children}</CookiesProvider>
);

export default CookieContext;
