import "reflect-metadata";
import { AppRouter } from "../../AppRouter";
import { Method } from "./Method";
import { MetadataKey } from "./MetadataKey";
import { RequestHandler, NextFunction, Response, Request } from "express";

function bodyValidators(keys: string): RequestHandler {
  return function(req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
      res.status(422).send("Invalid request");
      return;
    }

    for (let key of keys) {
      if (!req.body[key]) {
        res.status(422).send(`Missing property: ${key}`);
        return;
      }
    }

    next();
  };
}

export function controller(routePrefix: string) {
  const router = AppRouter.getInstance();

  return function(target: Function) {
    for (let key in target.prototype) {
      const routeHandler = target.prototype[key];
      const path = Reflect.getMetadata(MetadataKey.Path, target.prototype, key);
      const method: Method = Reflect.getMetadata(
        MetadataKey.Method,
        target.prototype,
        key
      );
      const middlewares =
        Reflect.getMetadata(MetadataKey.Middleware, target.prototype, key) ||
        [];

      const requiredBodyProps =
        Reflect.getMetadata(MetadataKey.Validator, target.prototype, key) || [];

      const validator = bodyValidators(requiredBodyProps);

      if (path) {
        router[method](
          `${routePrefix}${path}`,
          ...middlewares,
          validator,
          routeHandler
        );
      }
    }
  };
}
