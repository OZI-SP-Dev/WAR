import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './AppLeftNav.css';
import DateUtilities from '../../utilities/DateUtilities';

class AppLeftNav extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {

		let reviewStartDate = DateUtilities.getStartOfWeek(new Date());
		reviewStartDate.setDate(reviewStartDate.getDate() - 7);

		return (
			<nav className="col-md-2 d-none d-md-block bg-light sidebar">
				<div className="sidebar-sticky">
					<img src={process.env.PUBLIC_URL + '/xplogo.png'} alt="Logo" className="logo" />
					<h5 className="mt-5 ml-2">Helpful Links</h5>
					<ul className="nav flex-column">
						<li className="nav-item">
							<NavLink
								className="nav-link"
								exact to="/"
								isActive={(match, location) => location.pathname.includes("Activities") || location.pathname === "/"}
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                                Home
                            </NavLink>
						</li>
						<li className="nav-item">
							<a className="nav-link" href="https://www.af.mil/News/Coronavirus-Disease-2019/">
								<img width="24" height="24" src={process.env.PUBLIC_URL + '/COVID19.svg'} alt="Coronavirus Info" />&nbsp;Coronavirus Info</a>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" to="/WAR">
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bar-chart-2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                                WAR
                           </NavLink>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" to={`/Review?startDate=${reviewStartDate.toISOString()}&endDate=${DateUtilities.getStartOfWeek(new Date()).toISOString()}`}>
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
																Review
							</NavLink>
						</li>
					</ul>
				</div>
			</nav>
		);
	}
}

export default AppLeftNav;


