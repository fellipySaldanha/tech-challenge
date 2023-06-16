import { Request, Response } from "express";

class HelloWorld{

  public home(req:Request, res:Response) {
    return res.json({
      response: 'Hello World'
    });
  } 
}
export const helloWorld = new HelloWorld();