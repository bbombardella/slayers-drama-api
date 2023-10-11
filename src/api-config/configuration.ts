import { Config } from './model';

export default (): Config => ({
  database: {
    url: process.env.DATABASE_URL,
  },
  providers: {
    jwt: {
      secret: process.env.JWT_SECRET,
      refreshSecret: process.env.JWT_REFRESH_SECRET,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
    },
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID,
    },
  },
  tmdb: {
    apiKey: process.env.TMDB_API_KEY,
    url: process.env.TMDB_URL,
  },
});
