import React, { Component, Fragment } from 'react';

import { loadCase, saveCase, deleteCase, sortCaseAndSave, clearLocalStorage } from './functions';
import './style.scss';

class Home extends Component {
	componentDidMount() {
		this.renderCase();
	}

	state = {
		caseNo: '',
		trafficOffence: '',
		description: '',
		fine: '',
		deleteCaseNo: '',
		capturedCases: []
	};

	handleForm = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	onFormSubmit = (event) => {
		event.preventDefault();

		const caseData = this.state.capturedCases;

		const hasNoDuplicate = caseData.every((data) => data.caseNo !== this.state.caseNo.trim()); // Every : Iterates through each array element and returns a single true/false based on callback condition, stops executing immediately upon encountering first false

		const isFormEmpty =
			this.state.caseNo === '' ||
			this.state.trafficOffence === '' ||
			this.state.description === '' ||
			this.state.fine === '';

		const invalidFineAndCaseNumber =
			Number.isNaN(Number(this.state.caseNo.trim())) || Number.isNaN(Number(this.state.fine.trim()));
		/* 
		console.log('No Duplicate Found : ', hasNoDuplicate);
		console.log('Form is Empty : ', isFormEmpty);
		console.log('Case Number and Fine Numbers are invalid : ', invalidFineAndCaseNumber); */

		if (hasNoDuplicate && !isFormEmpty && !invalidFineAndCaseNumber) {
			this.createCase({
				caseNo: this.state.caseNo.trim(),
				trafficOffence: this.state.trafficOffence.trim(),
				description: this.state.description.trim(),
				fine: this.state.fine.trim()
			});

			window.location.reload();
		}
	};

	searchAndDelete = (event) => {
		event.preventDefault();

		deleteCase(this.state.deleteCaseNo).then((data) => {
			console.log('Success');

			window.location.reload();
		});
	};

	createCase = (data) => {
		console.log(data);

		const queryCall = saveCase(data);

		queryCall
			.then((data) => {
				console.log('Success mutating data');
				window.location.reload();
			})
			.catch((err) => {
				'Something went wrong mutating data';
			});
	};

	renderCase = () => {
		const queryCall = loadCase();

		queryCall
			.then((data) => {
				this.setState({ capturedCases: data.allCases });
			})
			.catch((err) => {
				console.log(err);
			});
	};

	captureCase = (data) => {
		return (
			<div className="renderCaseMap" key={data.caseNo}>
				<h3>Case Number : {data.caseNo}</h3>
				<div>
					<h3>Traffic Offence : {data.trafficOffence}</h3>
				</div>
				<div>
					<h3>Description</h3>
					<p> {data.description}</p>
				</div>
				<h3>Fine : {data.fine}</h3>
			</div>
		);
	};

	genereateCaseDom = () => {
		const caseArray = this.state.capturedCases.map((params) => this.captureCase(params));

		return (
			<div>
				<h1>CASE INFO</h1>
				{caseArray}
			</div>
		);
	};

	render() {
		return (
			<div className="page-container">
				<Fragment>
					<main>
						<h1>Make sure localhost is 3000</h1>
						<button type="button" onClick={clearLocalStorage}>
							Start From Scratch
						</button>

						<button type="button" onClick={sortCaseAndSave}>
							Sort
						</button>
					</main>
				</Fragment>
				<br />
				<br />
				<br />
				<br />
				<Fragment>
					<form>
						<input type="text" placeholder="Case No." name="caseNo" onChange={this.handleForm} required />
						<br />
						<br />
						<textarea
							name="trafficOffence"
							placeholder="Traffic Offence"
							onChange={this.handleForm}
							rows="5"
							cols="33"
							required
						/>
						<br />
						<br />
						<textarea
							name="description"
							placeholder="Description"
							onChange={this.handleForm}
							rows="5"
							cols="33"
							required
						/>
						<br />
						<br />
						<input type="text" placeholder="Fine" name="fine" onChange={this.handleForm} required />
						<button onClick={this.onFormSubmit}>Submit Case</button>
					</form>
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
					</form>
				</Fragment>
				<br />
				<br />
				<Fragment>
					{this.state.capturedCases.length > 0 ? (
						// this.state.capturedCases.map((params) => this.captureCase(params))
						this.genereateCaseDom()
					) : (
						'zero cases'
					)}
				</Fragment>
			</div>
		);
	}
}

export default Home;
