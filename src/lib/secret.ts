const secrets = {
  port: (process.env.port as string) || 7000,
  mongo_uri: process.env.mongo_uri || ("mongodb://localhost:27017" as string),
  jwt_secret: process.env.jwt_secret as string,
};

export default secrets;
