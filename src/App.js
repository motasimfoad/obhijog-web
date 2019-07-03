import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import SearchCase from './screens/SearchCase';

import './App.scss';

function AppRouter() {
	return (
		<Router>
			<Fragment>
				<Route exact path="/" exact component={Login} />
				<Route path="/dashboard" component={Dashboard} />
				<Route path="/search" component={SearchCase} />
			</Fragment>
		</Router>
	);
}

export default AppRouter;
