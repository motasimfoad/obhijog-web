import React, { Component, Fragment } from 'react';

import { signUpAccount, logInAccount } from '../../server/server';

// Utils
function emailIsValid(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

class Login extends Component {
	state = {
		email: '',
		password: '',
		accountCreated: '',
		pageStatus: 'signIn' //determine between sign up and sign in
	};

	signUp = (event) => {
		event.preventDefault();
		console.log('sending the mutation request');

		// Checking error prone codes
		if (!emailIsValid(this.state.email) || this.state.email.length < 8) {
			this.setState({
				accountCreated: 'invalid-params'
			});
			return;
		}

		const signupRequest = signUpAccount({ email: this.state.email, password: this.state.password });

		signupRequest
			.then((data) => {
				console.log('successfully signed in user', data);
				this.setState({
					accountCreated: 'new-account'
				});
			})
			.catch((e) => {
				this.setState({
					accountCreated: 'user-exists'
				});
				console.log('error while signing up user ', e);
			});
	};

	logIn = (event) => {
		event.preventDefault();
		console.log('sending the mutation request');

		const signinRequest = logInAccount({ email: this.state.email, password: this.state.password });

		signinRequest
			.then((data) => {
				console.log('successfully signed in user', data);
				// TODO keep the token in localstorage

				localStorage.setItem('auth', JSON.stringify({ token: data.signinUser.token, id: data.signinUser.user.id }));

				this.props.history.push({
					pathname: '/dashboard',
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

	changeAccountStatus = (accountCreated) => {
		console.log('changed to ' + accountCreated);
		this.setState({ accountCreated });
	};

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
						<Fragment>
							{this.state.accountCreated === 'invalid-params' && (
								<h4>Invalid email or password should be minimum 8 characters</h4>
							)}
						</Fragment>
						<Fragment>
							{this.state.accountCreated === 'user-exists' && <h4>User already exists with that email</h4>}
						</Fragment>
						<Fragment>{this.state.accountCreated === 'new-account' && <h4>SignUp successfully</h4>}</Fragment>
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
					{/* <div className="footer-note">
						{this.state.pageStatus === 'signUp' ? (
							<Fragment>
								Already signed up?{' '}
								<u
									onClick={() => {
										this.changePageStatus('signIn');
										this.changeAccountStatus('');
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
										this.changeAccountStatus('');
									}}
								>
									click here to sign up
								</u>
							</Fragment>
						)}
					</div> */}
				</div>
			</div>
		);
	}
}

export default Login;
