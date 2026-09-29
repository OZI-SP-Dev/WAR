import React, { createContext, useEffect, useState } from "react";
import { IObjectives, ObjectivesApiConfig } from "../api/ObjectivesApi";

export interface IObjectivesContext {
  objectives: IObjectives[];
  loading: boolean;
}

export const ObjectivesContext = createContext<Partial<IObjectivesContext>>({
  objectives: [],
  loading: true,
});
export const ObjectivesProvider: React.FunctionComponent = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [objectives, setObjectives] = useState<IObjectives[]>([]);

  const ObjectivesApi = ObjectivesApiConfig.ObjectivesApi;

  const fetchObjectives = async () => {
    const fetchedObjectives = await ObjectivesApi.fetchObjectives();
    setObjectives(fetchedObjectives ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchObjectives();
    // eslint-disable-next-line
  }, []);

  const objectivesContext: IObjectivesContext = {
    objectives,
    loading,
  };

  return (
    <ObjectivesContext.Provider value={objectivesContext}>
      {children}
    </ObjectivesContext.Provider>
  );
};

export const { Consumer } = ObjectivesContext;
