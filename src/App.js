import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Login from './screens/Login';
import Dashboard from './screens/Dashboard';

import './App.scss';

function AppRouter() {
	return (
		<Router>
			<Fragment>
				<Route exact path="/" exact component={Login} />
				<Route path="/dashboard" component={Dashboard} />
			</Fragment>
		</Router>
	);
}

export default AppRouter;
