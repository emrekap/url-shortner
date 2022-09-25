/**
 * Given a record type generic, returns a class that
 * will instantiate an instance that matches the given type
 */

interface Class<T> {
  new (args: T): T;
}

export const classMaker = <T extends Record<string, unknown>>(): Class<T> => {
  return class {
    constructor(x: T) {
      Object.assign(this, x);
    }
  } as any;
};
