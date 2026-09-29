import { IObjectivesApi, IObjectives } from "./ObjectivesApi";

export default class ObjectivesApiDev implements IObjectivesApi {
  objectives: IObjectives[] = [
    {
      Id: "1",
      Title: "a. Deliver Fight Tonight Readiness",
      Objective: {
        Id: "1",
        Title: "1. Own Mission Outcomes",
      },
    },
    {
      Id: "2",
      Title: "b. Deliver Modernized Capability at Speed",
      Objective: {
        Id: "1",
        Title: "1. Own Mission Outcomes",
      },
    },
    {
      Id: "3",
      Title: "c. Empower PAEs, while Driving Transparency & Insight",
      Objective: {
        Id: "1",
        Title: "1. Own Mission Outcomes",
      },
    },
    {
      Id: "4",
      Title: "a. Develop & Sustain World Class Talent",
      Objective: {
        Id: "2",
        Title: "2. Develop and Enable World Class Acquisition Fighters",
      },
    },
    {
      Id: "5",
      Title: "b. Deploy Talent Dynamically and Strategically",
      Objective: {
        Id: "2",
        Title: "2. Develop and Enable World Class Acquisition Fighters",
      },
    },
    {
      Id: "6",
      Title: "c. Modernize Our Power Projection Platform",
      Objective: {
        Id: "2",
        Title: "2. Develop and Enable World Class Acquisition Fighters",
      },
    },
    {
      Id: "7",
      Title: "a. Align Acquisition and OT&E Authorities",
      Objective: {
        Id: "3",
        Title: "3. Integrate to Win",
      },
    },
    {
      Id: "8",
      Title: "b. Engineer an Integrated Enterprise",
      Objective: {
        Id: "3",
        Title: "3. Integrate to Win",
      },
    },
    {
      Id: "9",
      Title: "c. Weaponize the Digital Ecosystem",
      Objective: {
        Id: "3",
        Title: "3. Integrate to Win",
      },
    },
    {
      Id: "10",
      Title: "a. Harness the Industrial Ecosystem",
      Objective: {
        Id: "4",
        Title: "4. Fuel the Arsenal of Freedom",
      },
    },
    {
      Id: "11",
      Title: "b. Forge Resilient Supply Chains",
      Objective: {
        Id: "4",
        Title: "4. Fuel the Arsenal of Freedom",
      },
    },
    {
      Id: "12",
      Title: "c. Cultivate a Competitive Marketplace",
      Objective: {
        Id: "4",
        Title: "4. Fuel the Arsenal of Freedom",
      },
    },
  ];

  sleep(m: number) {
    return new Promise((r) => setTimeout(r, m));
  }

  async fetchObjectives(): Promise<IObjectives[] | null | undefined> {
    await this.sleep(1500);
    return this.objectives;
  }
}
