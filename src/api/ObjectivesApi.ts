import { spWebContext } from "../providers/SPWebContext";
import ObjectivesApiDev from "./ObjectivesApiDev";

export interface IObjectivesApi {
  /**
   * Returns all IObjectives that are in the system.
   */
  fetchObjectives(): Promise<IObjectives[] | null | undefined>;
}

export interface IObjectives {
  Id: string;
  Title: string;
  Objective: {
    Title: string;
    Id: string;
  };
}

export default class ObjectivesApi implements IObjectivesApi {
  orgsList = spWebContext.lists.getByTitle("SubObjectives");

  fetchObjectives(): Promise<IObjectives[] | null | undefined> {
    return this.orgsList.items
      .select("Id", "Title", "Objective/Title", "Objective/Id")
      .expand("Objective")
      .get();
  }
}

export class ObjectivesApiConfig {
  static ObjectivesApi: IObjectivesApi =
    process.env.NODE_ENV === "development"
      ? new ObjectivesApiDev()
      : new ObjectivesApi();
}
