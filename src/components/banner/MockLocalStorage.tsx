const globalAny:any = global;

class LocalStorageMock {
  private store: object;

  constructor() {
    this.store = {};
  }

  public clear() {
    this.store = {};
  }

  public getItem(key: string) {
    return this.store[key] || null;
  }

  public setItem(key: string, value: any) {
    this.store[key] = value.toString();
  }

  public removeItem(key: string) {
    delete this.store[key];
  }
};

globalAny.localStorage = new LocalStorageMock;