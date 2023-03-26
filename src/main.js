const HttpServer = require("./http-server");

main()

async function main() {
    const httpServer = new HttpServer();
    const port = 3001
    try {
        await httpServer.listen(port)
        console.log(`Express App Listening on Port ${port}`);
    } catch (error) {
        console.error(`An error occurred: ${JSON.stringify(error)}`);
        process.exit(1);
    }
}
