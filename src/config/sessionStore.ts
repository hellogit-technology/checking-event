import MongoStore from 'connect-mongo';

export const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  collectionName: 'session'
});
