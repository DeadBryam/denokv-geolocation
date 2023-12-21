class Kv {
  private static instance: Kv;
  private denokv: Deno.Kv | undefined;

  private constructor() {
  }

  static async getInstance(): Promise<Kv> {
    if (!Kv.instance) {
      Kv.instance = new Kv();
      await Kv.instance.init();
    }

    return Kv.instance;
  }

  async init(): Promise<void> {
    this.denokv = await Deno.openKv();
  }

  getKv(): Deno.Kv {
    if (!this.denokv) {
      throw new Error('Kv not initialized');
    }

    return this.denokv;
  }
}

const kv = await Kv.getInstance();
await kv.init();

export { kv };
