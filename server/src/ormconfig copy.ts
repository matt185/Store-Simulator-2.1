export default {
   type: "postgres",
   host: "localhost",
   port: 5432,
   username: process.env.DB_USER,
   password: process.env.DB_PSW,
   database: process.env.DB_NAME,
   synchronize: false,
   logging: false,
   entities: [
      "src/entity/**/*.ts"
   ],
   migrations: [
      "src/migration/**/*.ts"
   ],
   subscribers: [
      "src/subscriber/**/*.ts"
   ],
   cli: {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
}