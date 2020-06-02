import React, { createContext, useState, useEffect } from "react";
import { RolesApiConfig, IRole } from "../../api/RolesApi";

export type RolesContext = {
	rolesList: IRole[],
	setRolesList: (value: React.SetStateAction<IRole[]>) => void,
	loading: boolean
}

export const RolesContext = createContext<Partial<RolesContext>>({ rolesList: [], loading: true });
export const RolesProvider: React.FunctionComponent = ({ children }) => {
	const [rolesList, setRolesList] = useState<IRole[]>([]);
	const [loading, setLoading] = useState(true);
	const rolesApi = RolesApiConfig.rolesApi;

	const getRoles = async () => {
		try {
			let roles = await rolesApi.fetchRoles();
			setRolesList(roles);
			setLoading(false);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	}

	useEffect(() => {
		getRoles().catch((error) => {
			console.log(error);
		})
		// eslint-disable-next-line
	}, [])

	// Wrap up items to pass to the provider
	const rolesContext: RolesContext = {
		rolesList,
		setRolesList,
		loading
	};

	return (<RolesContext.Provider value={rolesContext}>{children}</RolesContext.Provider>);
};

export const { Consumer } = RolesContext;