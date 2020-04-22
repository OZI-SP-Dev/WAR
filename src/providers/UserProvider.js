import React, { useState, useEffect } from 'react';
import { spWebContext } from './SPWebContext';
import '@pnp/sp/site-users';

export const UserContext = React.createContext();
export const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [Id, setId] = useState(null);
  const [Title, setTitle] = useState('Default User');
	const [Email, setEmail] = useState(null);
	const [UsersRoles, setUsersRoles] = useState([]);

  const getUser = async () => {
		if (process.env.NODE_ENV === 'development') {
			setUsersRoles(['Admin']);
      setLoading(false);
    } else {
      try {
        const web = spWebContext;
        let currentUser = await web.currentUser.get();
        setTitle(currentUser.Title);
        setId(currentUser.Id);
				setEmail(currentUser.Email);

				const filterstring = "UserId eq " + currentUser.Id;
				const myRoles = await web.lists.getByTitle("Roles").items.filter(filterstring).get();
				let roleNames = [];
				myRoles.forEach(element => {
					roleNames.push(element.Title);
				});
				setUsersRoles(roleNames);
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
    <UserContext.Provider value={{ loading, Title, Id, Email, UsersRoles }}>
      {children}
    </UserContext.Provider>
  )
}