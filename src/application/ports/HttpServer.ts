export default interface HttpServer {
	listen (port: number): void;
	register (method: string, url: string, callback: Function): Promise<void>;
}