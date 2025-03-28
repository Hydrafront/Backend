import Token from "../models/Token";

export default (io: any) => {
  io.on("connection", (socket: any) => {
    console.log("New client connected");

    socket.on("token-created", (token: any) => {
      io.emit("token-created", token);
    });

    socket.on("save-transaction", (transaction: any) => {
      io.emit("save-transaction", transaction);
      io.emit("send-transaction", {
        price: transaction.price,
        time: transaction.createdAt,
        symbol: transaction.symbol,
        volume: transaction.usd,
      });
    });

    socket.on("update-token-info", (data: any) => {
      Token.findOneAndUpdate(
        { tokenAddress: data.tokenAddress },
        { $set: { ...data } },
        { new: true },
        (err: any, token: any) => {
          if (err) {
            console.log(err);
          } else {
            io.emit("update-token-info", token);
          }
        }
      );
    });
    socket.on("update-boosted", (boost: number) => {
      io.emit("update-boosted", boost);
    });
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};
