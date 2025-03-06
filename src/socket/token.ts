export default (io: any) => {
    io.on("connection", (socket: any) => {
        console.log("New client connected");

        socket.on("token-created", (token: any) => {
            io.emit("token-created", token);
        });

        socket.on("save-transaction", (transaction: any) => {
            io.emit("save-transaction", transaction);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });
}