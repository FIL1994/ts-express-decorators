import "reflect-metadata";
import { MetadataKey } from "./MetadataKey";

export function bodyValidator(...keys: string[]) {
  return function(target: any, key: string, desc: PropertyDescriptor) {
    Reflect.defineMetadata(MetadataKey.Validator, keys, target, key);
  };
}
