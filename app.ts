
// @ts-ignore
import('custom-env')
.then(async (customEnv) => {
    customEnv.env(process.env.NODE_ENV);
    const { Server } =  await import("./server");
    const server = new Server();
    server.setPassportStrategy();
    server.setRoutes();
    server.setErrorHandlers();
    server.setQueues();
    server.startServer();
    server.setDbConnection();
});

