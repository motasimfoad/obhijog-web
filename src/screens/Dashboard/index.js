import React, { Component, Fragment } from 'react';
import { Redirect, Link } from 'react-router-dom';

import Caselist from './Caselist';
import Form from './Form';
import Modal from './Modal';

import { loadCase, deleteCase } from '../../server/server';
import { createSearchedCases } from '../../server/module';

async function addASearch(caseNumber) {
	createSearchedCases(caseNumber)
		.then((result) => {
			console.log('searchEntryCreated : ', result);
		})
		.catch((err) => {
			console.log('Error on onSearchHandler SearchCase', err);
		});
}

class Dashboard extends Component {
	state = {
		filterCase: '',
		deleteCaseNo: '',
		capturedCases: [],
		editCaseDatas: {},
		isLoggedIn: false
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

	renderCase = () => {
		loadCase()
			.then((data) => {
				if (!data.allCases || data.allCases.length === 0) {
					return;
				}

				let result;

				if (this.state.filterCase.length > 0 && !isNaN(this.state.filterCase)) {
					const caseFound = data.allCases.find((c) => {
						return c.caseNo === this.state.filterCase;
					});

					if (caseFound) {
						result = [ { ...caseFound } ];
					}
				}

				if (result) {
					addASearch(this.state.filterCase);
				}

				if (result === undefined) {
					/**
				 * NOTE:
				 * data.allCases comes back sorted by caseNumber but as a string ASCENDING ORDER (e.g. 1,10,11,12,13,...19,2,20) 
				 * So the code below sorts the cases by caseNumber as Numerical ASCENDING ORDER (e.g. 1,2,3,4)
				 */

					data.allCases.sort((a, b) => {
						const firstCaseNum = Number(a.caseNo);
						const secondCaseNum = Number(b.caseNo);

						if (firstCaseNum < secondCaseNum) {
							return -1; // return a
						} else if (firstCaseNum > secondCaseNum) {
							return 1; // return b
						} else {
							return 0; // return any one of them
						}
					});

					result = data.allCases;
				}

				console.log(result);
				this.setState({ capturedCases: result });
			})
			.catch((err) => {
				console.log('Error on renderCase Dashboard', err);
			});
	};

	closeModal = () => {
		this.setState({
			editCaseDatas: {}
		});
	};

	setEditModal = (data) => {
		this.setState({
			editCaseDatas: data
		});
	};

	handleForm = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	editCaseDatasIsEmpty = () => {
		return Object.values(this.state.editCaseDatas).length === 0;
	};

	search = (event) => {
		event.preventDefault();
		this.renderCase();
	};

	searchAndDelete = (event) => {
		event.preventDefault();

		deleteCase(this.state.deleteCaseNo)
			.then((data) => {
				console.log('Conclusion :', data);

				if (data) {
					this.renderCase();
				}
			})
			.catch((err) => {
				console.log('Error on searchAndDelete Dashboard', err);
			});
	};

	render() {
		return this.state.isLoggedIn === true ? (
			<div>
				<nav className="flex-nav">
					{/* <Link to="/search">Trending Cases</Link> */}
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
					<header>
						<h1>অভিযোগ কেস তালিকা</h1>
					</header>

					<Fragment>
						{this.editCaseDatasIsEmpty() && <Form renderCase={this.renderCase.bind(this)} caseState={this.state} />}
					</Fragment>
					<br />
					<Fragment>
						{this.editCaseDatasIsEmpty() && (
							<form>
								<input
									type="text"
									placeholder="Case Number to Delete"
									name="deleteCaseNo"
									required
									onChange={this.handleForm}
								/>
								<button type="submit" onClick={this.searchAndDelete}>
									Delete Case
								</button>
							</form>
						)}
					</Fragment>
					<br />
					{/* <Fragment>
						{this.editCaseDatasIsEmpty() && (
							<Fragment>
								<input type="text" placeholder="Search" name="filterCase" required onChange={this.handleForm} />
								<button type="submit" onClick={this.search}>
									Search
								</button>
							</Fragment>
						)}
					</Fragment> */}
					<br />
					<Fragment>
						{!this.editCaseDatasIsEmpty() ? (
							<Modal
								caseData={this.state.editCaseDatas}
								closeModal={this.closeModal.bind(this)}
								renderCase={this.renderCase}
							/>
						) : this.state.capturedCases.length > 0 ? (
							<Caselist setEditModal={this.setEditModal.bind(this)} caseState={this.state} />
						) : (
							'loading...'
						)}
					</Fragment>
				</div>
			</div>
		) : (
			<Redirect to="/" push />
		);
	}
}

export default Dashboard;
