import React, { createContext, useState, useEffect } from "react";
import { RolesApiConfig, IRole } from "./RolesApi";

export type RolesContext = {
	rolesList: IRole[],
	setRolesList: (value: React.SetStateAction<IRole[]>) => void,
	loading: boolean
}

export const RolesContext = createContext<Partial<RolesContext>>({ rolesList: [], loading: true });
export const RolesProvider: React.FunctionComponent = ({ children }) => {
	// Use State to keep the values
	const [rolesList, setRolesList] = useState<IRole[]>([]);
	const [loading, setLoading] = useState(true);
	const rolesApi = RolesApiConfig.rolesApi;

	const getRoles = async () => {
		// if (process.env.NODE_ENV === 'development') {
		// 	setLoading(false);
		// } else {
			try {
				let roles = await rolesApi.fetchRoles();
				setRolesList(roles);
				setLoading(false);
			} catch (error) {
				console.log(error);
				setLoading(false);
			}
		//}
	}

	useEffect(() => {
		getRoles().catch((error) => {
			console.log(error);
		})
	}, [])

	// Make the context object:
	const rolesContext: RolesContext = {
		rolesList,
		setRolesList,
		loading
	};

	// pass the value in provider and return
	return (<RolesContext.Provider value={rolesContext}>{ children }</RolesContext.Provider>);
};

export const { Consumer } = RolesContext;