import React, { createContext, useEffect, useState } from "react";
import { IOrgs, OrgsApiConfig } from "../api/OrgsApi";


export interface IOrgsContext {
    orgs: string[],
    loading: boolean
}

export const OrgsContext = createContext<Partial<IOrgsContext>>({ orgs: [], loading: true });
export const OrgsProvider: React.FunctionComponent = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [orgs, setOrgs] = useState<string[]>([]);

    const orgsApi = OrgsApiConfig.orgsApi;

    const fetchOrgs = async () => {
        const fetchedOrgs = await orgsApi.fetchOrgs();
        setOrgs(fetchedOrgs ? fetchedOrgs.map(org => org.Title) : []);
        setLoading(false);
    }

    useEffect(() => {
        fetchOrgs();
        // eslint-disable-next-line
    }, []);

    const orgsContext: IOrgsContext = {
        orgs,
        loading
    }

    return (<OrgsContext.Provider value={orgsContext}>{children}</OrgsContext.Provider>)
};

export const { Consumer } = OrgsContext