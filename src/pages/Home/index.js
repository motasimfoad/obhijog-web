import React, { Component, Fragment } from 'react';

import Form from './Form';
import Caselist from './Caselist';
import { loadCase, deleteCase } from './server';
import './style.scss';

import Modal from './Modal';

class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			caseNo: '',
			trafficOffence: '',
			description: '',
			fine: '',
			deleteCaseNo: '',
			capturedCases: [],
			editCaseDatas: {},
			isLoggedIn: false
		};
	}

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

	// createCase = (data, operation) => {
	// 	const queryCall = saveCase(data, operation);

	// 	queryCall
	// 		.then((data) => {
	// 			console.log('Success mutating data');

	// 			this.renderCase();
	// 		})
	// 		.catch((err) => {
	// 			console.log('Something went wrong mutating data');
	// 		});
	// };

	renderCase = () => {
		const queryCall = loadCase();

		queryCall
			.then((data) => {
				// data.allCases comes back sorted with caseNumber by string so the code below sorts the casees by caseNumber as Number
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
				console.log(err);
			});
	};

	// captureCase = (data) => {
	// 	return (
	// 		<div
	// 			className="renderCaseMap"
	// 			key={data.caseNo}
	// 			onDoubleClick={() => {
	// 				this.setState({
	// 					editCaseDatas: { ...data }
	// 				});
	// 			}}
	// 		>
	// 			<h3>Case Number : {data.caseNo}</h3>
	// 			<div>
	// 				<h3>Traffic Offence : {data.trafficOffence}</h3>
	// 			</div>
	// 			<div>
	// 				<h3>Description :</h3>
	// 				<p> {data.description}</p>
	// 			</div>
	// 			<h3>Fine : {data.fine}</h3>
	// 		</div>
	// 	);
	// };

	// genereateCaseDom = () => {
	// 	const caseArray = this.state.capturedCases.map((params) => this.captureCase(params));
	// 	return (
	// 		<div>
	// 			<h1>CASE INFO</h1>
	// 			{caseArray}
	// 		</div>
	// 	);
	// };
	handleForm = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	searchAndDelete = (event) => {
		event.preventDefault();

		deleteCase(this.state.deleteCaseNo).then((data) => {
			console.log('4th then, Conclusion :', data);
			this.renderCase();
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

	render() {
		return this.state.isLoggedIn === true ? (
			<div className="page-container">
				<header>
					<main>
						<h1>অভিযোগ কেস তালিকা</h1>
					</main>
				</header>
				<br />
				<br />
				<br />
				<br />
				<Fragment>
					<Form renderCase={this.renderCase.bind(this)} caseState={this.state} />
				</Fragment>
				<br />
				<Fragment>
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
				</Fragment>
				<br />
				<br />
				<Fragment>
					{Object.values(this.state.editCaseDatas).length > 0 && (
						<Modal
							caseData={this.state.editCaseDatas}
							closeModal={this.closeModal}
							renderCase={this.renderCase}
						/>
					)}
				</Fragment>
				<br />
				<br />
				<Fragment>
					{/* this.genereateCaseDom() */}
					{Object.values(this.state.editCaseDatas).length === 0 &&
						(this.state.capturedCases.length > 0 ? (
							<Caselist setEditModal={this.setEditModal.bind(this)} caseState={this.state} />
						) : (
							'loading...'
						))}
				</Fragment>
			</div>
		) : (
			<h1>You must be logged in to view this page</h1>
		);
	}
}

export default Home;
