import { IOrgsApi, IOrgs } from "./OrgsApi";

export default class OrgsApiDev implements IOrgsApi {
  orgs: IOrgs[] = [
    {
      Id: "1",
      Title: "OZI",
    },
    {
      Id: "2",
      Title: "OZIC",
    },
    {
      Id: "3",
      Title: "OZIF",
    },
    {
      Id: "4",
      Title: "OZIP",
    },
  ];

  sleep(m: number) {
    return new Promise((r) => setTimeout(r, m));
  }

  async fetchOrgs(): Promise<IOrgs[] | null | undefined> {
    await this.sleep(1500);
    return this.orgs;
  }
}
