import React, { useState, useEffect } from 'react';
import { spWebContext } from './SPWebContext';
import '@pnp/sp/site-users';

export const UserContext = React.createContext();
export const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [Id, setId] = useState(null);
  const [Title, setTitle] = useState('Default User');
  const [Email, setEmail] = useState(null);

  const getUser = async () => {
    if (process.env.NODE_ENV === 'development') {
      setLoading(false);
    } else {
      try {
        const web = spWebContext;
        let currentUser = await web.currentUser.get();
        setTitle(currentUser.Title);
        setId(currentUser.Id);
        setEmail(currentUser.Email);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    getUser().catch((error) => {
      console.log(error);
    })
  }, [])

  return (
    <UserContext.Provider value={{ loading, Title, Id, Email }}>
      {children}
    </UserContext.Provider>
  )
}