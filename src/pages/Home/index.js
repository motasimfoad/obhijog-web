import React, { Component, Fragment } from 'react';

import { loadCase, saveCase, sortCaseAndSave, clearLocalStorage } from './functions';
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
		const caseData = loadCase();

		const hasNoDuplicate = caseData.every((data) => data.caseNo !== this.state.caseNo.trim()); // Every : Iterates through each array element and returns a single true/false based on callback condition, stops executing immediately upon encountering first false

		const isFormEmpty =
			this.state.caseNo === '' ||
			this.state.trafficOffence === '' ||
			this.state.description === '' ||
			this.state.fine === '';

		const invalidFineAndCaseNumber =
			Number.isNaN(Number(this.state.caseNo.trim())) || Number.isNaN(Number(this.state.fine.trim()));

		console.log('No Duplicate Found : ', hasNoDuplicate);
		console.log('Form is Empty : ', isFormEmpty);
		console.log('Case Number and Fine Numbers are invalid : ', invalidFineAndCaseNumber);

		if (hasNoDuplicate && !isFormEmpty && !invalidFineAndCaseNumber) {
			caseData.unshift({
				caseNo: this.state.caseNo.trim(),
				trafficOffence: this.state.trafficOffence.trim(),
				description: this.state.description.trim(),
				fine: this.state.fine.trim()
			});
			saveCase(caseData);
			window.location.reload();
		}
	};

	searchAndDelete = (event) => {
		event.preventDefault();
		const caseData = loadCase();
		const caseDataToKeep = caseData.filter((data) => data.caseNo !== this.state.deleteCaseNo.trim());

		if (caseData.length > caseDataToKeep.length) {
			saveCase(caseDataToKeep);
			window.location.reload();
		}
	};

	printCaseJSON = () => {
		return (
			<div>
				<h1>CASE JSON</h1>
				<div>{JSON.stringify(loadCase())}</div>
			</div>
		);
	};

	renderCase = () => {
		// const renderCases = [];

		const queryCall = loadCase();

		queryCall
			.then((data) => {
				// console.log(data.allCases[0].description);
				this.setState({ capturedCases: data.allCases });
			})
			.catch((err) => {
				console.log(err);
			});

		// this.setState({
		// 	captureCase: caseData
		// });
		// function getCase(callback) {
		//
		// 	console.log('caseData: ', caseData);
		// 	callback(caseData);
		// }

		/* 		getCase((data) => {

			renderCases = data.map((data) => (
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
			));

			return (
				<div>
					<h1>CASE INFO</h1>
					{renderCases}
				</div>
			);
		}); */
	};

	captureCase = (data) => {
		return (
			<div>
				<h1>CASE INFO</h1>
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
						this.state.capturedCases.map((params) => this.captureCase(params))
					) : (
						'zero cases'
					)}
				</Fragment>
				<br />
				<br />
				<Fragment>{this.printCaseJSON()}</Fragment>
			</div>
		);
	}
}

export default Home;
