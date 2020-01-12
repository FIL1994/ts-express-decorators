import "reflect-metadata";
import { AppRouter } from "../../AppRouter";
import { Method } from "./Method";
import { MetadataKey } from "./MetadataKey";

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
      const middlwares =
        Reflect.getMetadata(MetadataKey.Middleware, target.prototype, key) ||
        [];

      if (path) {
        router[method](`${routePrefix}${path}`, ...middlwares, routeHandler);
      }
    }
  };
}
