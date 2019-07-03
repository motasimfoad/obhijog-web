import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { fetchSearchedCases, createSearchedCases } from '../../server/module';

class SearchCase extends Component {
	state = {
		isLoggedIn: false,
		mounted: true,
		caseNumber: '',
		data: []
	};

	componentWillMount() {
		const auth = localStorage.getItem('auth');

		if (auth) {
			this.setState({
				isLoggedIn: true
			});

			this.renderCase();
		} else {
			this.props.history.push({
				pathname: '/'
			});
		}
	}

	componentWillUnmount() {
		this.setState({
			mount: false
		});
	}

	handleForm = (event) => {
		event.preventDefault();
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	renderCase = () => {
		fetchSearchedCases()
			.then((data) => {
				console.log(data);
				if (data) {
					this.setState({
						data: data
					});
				}
			})
			.catch((err) => {
				console.log('Error on renderCase SearchCase', err);
			});
	};

	onSearchHandler = (event) => {
		event.preventDefault();

		const invalidNumber = isNaN(this.state.caseNumber);

		if (invalidNumber) {
			console.log('invalidnumber');
			return;
		}

		createSearchedCases(this.state.caseNumber)
			.then((result) => {
				console.log('searchEntryCreated : ', result);
				if (result) {
					this.renderCase();
				}
			})
			.catch((err) => {
				console.log('Error on onSearchHandler SearchCase', err);
			});
	};

	render() {
		if (!this.state.mounted) {
			return;
		}
		return this.state.isLoggedIn === true ? (
			<div>
				<nav className="flex-nav">
					<Link to="/search">Trending Cases</Link>
					<Link to="/dashboard">Dashboard</Link>
					<div
						id="logout"
						onClick={() => {
							localStorage.removeItem('auth');
							this.setState({
								isLoggedIn: false
							});
						}}
					>
						Logout
					</div>
				</nav>
				<div className="page-container">
					<div>
						<input type="text" placeholder="Type case number" name="caseNumber" onChange={this.handleForm} />
						<button onClick={this.onSearchHandler}>createSearch</button>
					</div>
					<div>
						<h2>TRENDING CASES</h2>
						{this.state.data.length > 0 &&
							this.state.data.map((data) => {
								return (
									<div className="renderCaseMap" key={data.id}>
										<h3>CaseNo : {data.caseNo}</h3>
										<h3>Traffic Offence : {data.trafficOffence}</h3>
										<h3>Description : {data.description}</h3>
										<h3>Fine : {data.fine}</h3>
									</div>
								);
							})}
					</div>
				</div>
			</div>
		) : (
			<Redirect to="/" push />
		);
	}
}

export default SearchCase;
