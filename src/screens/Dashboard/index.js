import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';

import Caselist from './Caselist';
import Form from './Form';
import Modal from './Modal';

import { loadCase, deleteCase } from '../../server/server';

class Dashboard extends Component {
	state = {
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
		const queryCall = loadCase();

		queryCall
			.then((data) => {
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

				this.setState({ capturedCases: data.allCases });
			})
			.catch((err) => {
				console.log('Error on renderCase', err);
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

	searchAndDelete = (event) => {
		event.preventDefault();

		deleteCase(this.state.deleteCaseNo)
			.then((data) => {
				console.log('4th then, Conclusion :', data);

				if (typeof data === 'object') {
					this.renderCase();
				}
			})
			.catch((err) => {
				console.log('Error on searchAndDelete', err);
			});
	};

	render() {
		return this.state.isLoggedIn === true ? (
			<div className="page-container">
				<header>
					<h1>অভিযোগ কেস তালিকা</h1>
				</header>

				<Fragment>
					{this.editCaseDatasIsEmpty() && (
						<Form renderCase={this.renderCase.bind(this)} caseState={this.state} />
					)}
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
							<button
								onClick={() => {
									localStorage.removeItem('auth');
									this.setState({
										isLoggedIn: false
									});
								}}
							>
								Logout
							</button>
						</form>
					)}
				</Fragment>
				<br />
				<br />
				<Fragment>
					{!this.editCaseDatasIsEmpty() ? (
						<Modal
							caseData={this.state.editCaseDatas}
							closeModal={this.closeModal}
							renderCase={this.renderCase}
						/>
					) : this.state.capturedCases.length > 0 ? (
						<Caselist setEditModal={this.setEditModal.bind(this)} caseState={this.state} />
					) : (
						'loading...'
					)}
				</Fragment>
			</div>
		) : (
			<Redirect to="/" push />
		);
	}
}

export default Dashboard;
