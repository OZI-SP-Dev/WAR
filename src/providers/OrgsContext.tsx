import React, { createContext, useEffect, useState } from "react";
import { OrgsApiConfig } from "../api/OrgsApi";


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
        setOrgs(fetchedOrgs ? fetchedOrgs.map(org => org.Title).sort((org1, org2) => org1 > org2 ? 1 : org1 < org2 ? -1 : 0) : []);
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