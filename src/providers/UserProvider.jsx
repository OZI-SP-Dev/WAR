import '@pnp/sp/site-users';
import { TestImages } from '@uifabric/example-data';
import React, { useEffect, useState } from 'react';
import { UserPreferencesApiConfig } from '../api/UserPreferencesApi';
import RoleUtilities from '../utilities/RoleUtilities';
import { spWebContext } from './SPWebContext';

export const UserContext = React.createContext();
export const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [Id, setId] = useState(null);
  const [Title, setTitle] = useState(null);
  const [Email, setEmail] = useState(null);
  const [UsersRoles, setUsersRoles] = useState([]);
  const [UserPreferences, setUserPreferences] = useState(null);
  const [Persona, setPersona] = useState(null);
  
  const userPreferencesApi = UserPreferencesApiConfig.userPreferencesApi;

  const getUser = async () => {
		if (process.env.NODE_ENV === 'development') {
			setId("1");
			setTitle('Default User');
			setEmail('me@example.com');
      setUsersRoles([{ role: RoleUtilities.ADMIN, deparment: undefined }]);
      setUserPreferences(await userPreferencesApi.fetchPreferences('1'));
			setPersona({ text: 'Default User', imageUrl: TestImages.personaMale });
      setLoading(false);
    } else {
      try {
        const web = spWebContext;
				let currentUser = await web.currentUser.get();
				console.log(currentUser);
        setTitle(currentUser.Title);
        setId(currentUser.Id);
				setEmail(currentUser.Email);
				setPersona({
					text: currentUser.Title,
					imageUrl: "/_layouts/15/userphoto.aspx?accountname=" + currentUser.LoginName + "&size=S",
					Email: currentUser.Email
				});

        const filterstring = "UserId eq " + currentUser.Id;
        const myRoles = await web.lists.getByTitle("Roles").items.filter(filterstring).get();
        let roleNames = [];
        myRoles.forEach(element => {
          roleNames.push({ role: element.Title, department: element.Department });
        });
        setUsersRoles(roleNames);
        setUserPreferences(await userPreferencesApi.fetchPreferences(currentUser.Id));
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
    <UserContext.Provider value={{ loading, Title, Id, Email, UsersRoles, UserPreferences, Persona }}>
      {children}
    </UserContext.Provider>
  )
}