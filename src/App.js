import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Authenticate';

function AppRouter() {
	return (
		<Router>
			<Fragment>
				<Route exact path="/" exact component={Login} />
				<Route path="/home" component={Home} />
			</Fragment>
		</Router>
	);
}

export default AppRouter;
