import React, { useState, useEffect } from 'react';
import { Web } from '@pnp/sp/webs';
import '@pnp/sp/site-users';

export const UserContext = React.createContext();
export const UserProvider = ({ children }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const getUser = async () => {
      //TODO move web to a provider
        const web = new Web('https://usaf.dps.mil/teams/10251').configure({
            headers: { "Accept": "application/json; odata=verbose" }
        });

        setLoading(true);
        let newUser = {Title: 'Default User'};
        try {
          newUser = await web.currentUser.get();
        } catch (error) {console.log(error);}

        setData(newUser.Title);
        setLoading(false);
    }

    useEffect(() => {
        getUser().catch((error) => {
          console.log(error);
          setData('Test User');
          setLoading(false);
        })
    }, [])

    return (
      <UserContext.Provider value={{ loading, data }}>
          {children}
      </UserContext.Provider>
    )
}