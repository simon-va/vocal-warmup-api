import { HelmetOptions } from 'helmet';

export const getHelmetConfig: () => Readonly<HelmetOptions> = () => ({
  noSniff: true,
  hidePoweredBy: true,
  hsts:
    process.env.NODE_ENV === 'production'
      ? {
          maxAge: 31536000,
          preload: false,
          includeSubDomains: true,
        }
      : false,
  contentSecurityPolicy: false,
});
