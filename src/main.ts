import ExpressAdapter from "./application/adapters/ExpressAdapter";

const server = new ExpressAdapter();
server.listen(3000);