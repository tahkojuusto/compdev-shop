import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';

import { config } from './utils';

export const checkJwt = jwt({
  // Anonymous access also allowed.
  credentialsRequired: false,
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${config.auth.issuer}.well-known/jwks.json`,
  }),
  audience: config.auth.audience,
  issuer: config.auth.issuer,
  algorithms: ['RS256'],
});
