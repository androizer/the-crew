// This file can be replaced during build by using the `fileReplacements` array.
// When building for production, this file is replaced with `environment.prod.ts`.

export const environment = {
  production: false,
  apiUrl: process.env.NX_API_URL,
  googleClientId: process.env.NX_GOOGLE_AUTH_CLIENT_ID,
  convenienceFee: parseInt(process.env.NX_CONVENIENCE_FEE),
};
