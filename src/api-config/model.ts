export class ConfigDatabase {
  url: string;

  constructor(url: string) {
    this.url = url;
  }
}

export class ConfigProvider {
  clientId: string;

  constructor(clientId: string) {
    this.clientId = clientId;
  }
}

export class ConfigJwtProvider {
  secret: string;
  refreshSecret: string;

  constructor(secret: string, refreshSecret: string) {
    this.secret = secret;
    this.refreshSecret = refreshSecret;
  }
}

export class ConfigProviders {
  jwt: ConfigJwtProvider;
  google: ConfigProvider;
  microsoft: ConfigProvider;

  constructor(
    jwt: ConfigJwtProvider,
    google: ConfigProvider,
    microsoft: ConfigProvider,
  ) {
    this.jwt = jwt;
    this.google = google;
    this.microsoft = microsoft;
  }
}

export class ConfigTMDB {
  apiKey: string;
  url: string;

  constructor(apiKey: string, url: string) {
    this.apiKey = apiKey;
    this.url = url;
  }
}

export class Config {
  database: ConfigDatabase;
  providers: ConfigProviders;
  tmdb: ConfigTMDB;


  constructor(database: ConfigDatabase, providers: ConfigProviders, tmdb: ConfigTMDB) {
    this.database = database;
    this.providers = providers;
    this.tmdb = tmdb;
  }
}
