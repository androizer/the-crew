export const environment = {
  production: true,
  apiUrl: process.env.NX_API_URL_PROD,
  googleClientId: process.env.NX_GOOGLE_AUTH_CLIENT_ID,
  convenienceFee: parseInt(process.env.NX_CONVENIENCE_FEE),
};
