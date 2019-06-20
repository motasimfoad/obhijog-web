import React, { Component, Fragment } from 'react';
import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('https://api.graph.cool/simple/v1/cjuvnbmub0zij0176xcsvoni9', {
	headers: {
		Authorization: 'Bearer YOUR_AUTH_TOKEN'
	}
});

class Login extends Component {
	state = {
		email: '',
		password: '',
		pageStatus: 'signUp' //determine between sign up and sign in
	};

	signUp = (event) => {
		event.preventDefault();
		console.log('sending the mutation request');

		const signupRequest = client.request(`
				mutation		
				{
					createUser(
						authProvider: {
							email: {
								email: "${this.state.email}"
								password: "${this.state.password}"
							}
						}
					) {
						email
						password
					}
        }
				`);

		signupRequest
			.then((data) => {
				console.log('successfully signed in user', data);
			})
			.catch((e) => {
				console.log('error while signing up user ', e);
			});
	};

	logIn = (event) => {
		event.preventDefault();
		console.log('sending the mutation request');

		const signinRequest = client.request(`
				mutation {
					signinUser(
						email: {
              email: "${this.state.email}"
              password: "${this.state.password}"
            }
					) {
						token
						user {
							email
							password
            }
					}
        }
				`);

		signinRequest
			.then((data) => {
				console.log('successfully signed in user', data);
				// TODO keep the token in localstorage
				localStorage.setItem('auth', data.signinUser.token);
				// <Redirect to="/home" />;
				// this.props.history.push(`/home`);
				// this.context.router.push({
				// 	pathname: '/home',
				// 	state: { test: 'testing testing' }
				// });

				this.props.history.push({
					pathname: '/home',
					state: { loggedIn: true }
				});
			})
			.catch((e) => {
				console.log('error while signing in user ', e);
			});
	};

	handleForm = (event) => {
		console.log('changing the value of ' + event.target.name + ' to ' + event.target.value);
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	changePageStatus = (pageStatus) => {
		console.log('changed to ' + pageStatus);
		this.setState({ pageStatus });
	};

	// Render
	render() {
		return (
			<div className="page-container">
				<div className="form">
					<div>
						{this.state.pageStatus === 'signUp' && (
							<Fragment>
								<h1>Sign Up </h1>
								<p>Please fill in this form to create an account.</p>
							</Fragment>
						)}
						{this.state.pageStatus === 'signIn' && (
							<Fragment>
								<h1>Sign In </h1>
								<p>Please log in.</p>
							</Fragment>
						)}
						<br />
						<input
							type="email"
							placeholder="Enter Email"
							name="email"
							value={this.state.email}
							onChange={this.handleForm}
							required
						/>
						<br />
						<br />
						<label htmlFor="password" />
						<input
							type="password"
							placeholder="Enter Password"
							name="password"
							value={this.state.password}
							onChange={this.handleForm}
							required
						/>
						<br />
						<br />
						<div className="clearfix">
							{this.state.pageStatus === 'signUp' && (
								<button type="button" className="signupbtn" onClick={this.signUp}>
									Sign Up
								</button>
							)}
							{this.state.pageStatus === 'signIn' && (
								<button type="button" className="signupbtn" onClick={this.logIn}>
									Log In
								</button>
							)}
						</div>
					</div>
					<div className="footer-note">
						{this.state.pageStatus === 'signUp' ? (
							<Fragment>
								Already signed up?{' '}
								<u
									onClick={() => {
										this.changePageStatus('signIn');
									}}
								>
									click here to sign in
								</u>
							</Fragment>
						) : (
							<Fragment>
								New user?{' '}
								<u
									onClick={() => {
										this.changePageStatus('signUp');
									}}
								>
									click here to sign up
								</u>
							</Fragment>
						)}
					</div>
				</div>
			</div>
		);
	}
}

export default Login;
