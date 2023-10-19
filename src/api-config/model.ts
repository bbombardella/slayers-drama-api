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
  urlImageBase: string;

  constructor(apiKey: string, url: string, urlImageBase: string) {
    this.apiKey = apiKey;
    this.url = url;
    this.urlImageBase = urlImageBase;
  }
}

export class ConfigCloudinary {
  name: string;
  apiKey: string;
  apiSecret: string;

  constructor(name: string, apiKey: string, apiSecret: string) {
    this.name = name;
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }
}

export class ConfigStripe {
  apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
}

export class ConfigMailgun {
  name: string;
  apiKey: string;
  domain: string;

  constructor(name: string, apiKey: string, domain: string) {
    this.name = name;
    this.apiKey = apiKey;
    this.domain = domain;
  }
}

export class Config {
  database: ConfigDatabase;
  providers: ConfigProviders;
  tmdb: ConfigTMDB;
  cloudinary: ConfigCloudinary;
  stripe: ConfigStripe;
  mailgun: ConfigMailgun;

  constructor(
    database: ConfigDatabase,
    providers: ConfigProviders,
    tmdb: ConfigTMDB,
    cloudinary: ConfigCloudinary,
    stripe: ConfigStripe,
    mailgun: ConfigMailgun,
  ) {
    this.database = database;
    this.providers = providers;
    this.tmdb = tmdb;
    this.cloudinary = cloudinary;
    this.stripe = stripe;
    this.mailgun = mailgun;
  }
}
