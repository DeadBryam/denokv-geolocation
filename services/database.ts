class DataBase {
  private static instance: DataBase;
  private denokv: Deno.Kv | undefined;

  private constructor() {
  }

  static async getInstance(): Promise<DataBase> {
    if (!DataBase.instance) {
      DataBase.instance = new DataBase();
      await DataBase.instance.init();
    }

    return DataBase.instance;
  }

  async init(): Promise<void> {
    this.denokv = await Deno.openKv();
  }

  getKv(): Deno.Kv {
    if (!this.denokv) {
      throw new Error('DataBase not initialized');
    }

    return this.denokv;
  }
}

const db = await DataBase.getInstance();
await db.init();

export { db };
