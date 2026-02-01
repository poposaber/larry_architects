if (!process.env.DATABASE_URL) {
  try {
     process.loadEnvFile();
  } catch (e) { }
}

export default {
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
