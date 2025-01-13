interface dbConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: string;
}

interface dbConfigInterface {
  development: dbConfig;
  production?: dbConfig;
  test?: dbConfig;
}

export { dbConfigInterface };
