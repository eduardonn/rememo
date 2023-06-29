import postgres from 'postgres';

const sql = postgres({
  host       :   process.env.PGSQL_HOST,
  port       :   (Number)(process.env.PGSQL_PORT),
  database   :   process.env.PGSQL_DATABASE,
  username   :   process.env.PGSQL_USER,
  password   :   process.env.PGSQL_PASSWORD,
  transform: {
    undefined: null
  },
})

export default sql