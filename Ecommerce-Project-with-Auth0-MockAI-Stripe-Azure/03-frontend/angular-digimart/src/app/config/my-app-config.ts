export default {
  auth: {
    domain: "dev-jh40eir8j1podnbf.us.auth0.com",
    clientId: "LHVHDrj6hhV0B1ke21R1avox2nDp9BNA",
    authorizationParams: {
      redirect_uri: "https://gray-ocean-09ecb650f.1.azurestaticapps.net/login/callback",
      audience: "http://localhost:8080",   // this is simply a unique identifier (audience) for the api we created in auth0 platform. Its has nothing to do with what port or env my backend is running on. i could have named it anything like "http://my-app.com" etc, but i chose this 8080 one as this si common and standard. This has nothing to do with backend server ports (8443, 9898)
    },
    cacheLocation: 'localstorage',
    useRefreshTokens: true
  },
  httpInterceptor: {
    allowedList: [
      // Dev backend endpoints
      'https://localhost:8443/api/orders/**',
      'https://localhost:8443/api/checkout/purchase',

      // QA backend endpoints (for staging testing, if needed)
      'https://localhost:9898/api/orders/**',
      'https://localhost:9898/api/checkout/purchase',

      // prod endpoints
      'https://ecommerce-backend-api123.azurewebsites.net/api/orders/**',
      'https://ecommerce-backend-api123.azurewebsites.net/api/checkout/purchase'
    ],
  },
}
