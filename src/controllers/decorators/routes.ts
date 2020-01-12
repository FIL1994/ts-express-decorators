import "reflect-metadata";
import { Method } from "./Method";
import { MetadataKey } from "./MetadataKey";
import { RequestHandler } from "express";

interface RouteHandlerDesriptor extends PropertyDescriptor {
  value?: RequestHandler;
}

function routeBinder(method: Method) {
  return function(path: string) {
    return function(target: any, key: string, desc: RouteHandlerDesriptor) {
      Reflect.defineMetadata(MetadataKey.Path, path, target, key);
      Reflect.defineMetadata(MetadataKey.Method, method, target, key);
    };
  };
}

export const get = routeBinder(Method.get);
export const put = routeBinder(Method.put);
export const post = routeBinder(Method.post);
export const del = routeBinder(Method.del);
export const patch = routeBinder(Method.patch);
