import express from "express";
import HttpServer from "../ports/HttpServer";
import { router } from "../router";


export default class ExpressAdapter implements HttpServer {
	server: any;

	constructor () {
		this.server = express();
        this.middleware();
        this.router();
	}

	listen(port: number): void {
		return this.server.listen(port);
	}

    private middleware(){
        this.server.use(express.json());
    }

    private router(){
        this.server.use(router);
    }

}