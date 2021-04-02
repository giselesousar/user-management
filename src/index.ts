import 'reflect-metadata';
import { connection } from './config/typeorm';
import { startServer } from './server';
require('dotenv/config');

async function main() {
    connection();
    const app = await startServer();
    app.listen(4000);

    console.log("Server on port", 4000)
}

main();