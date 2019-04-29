import React, { Component, Fragment } from 'react';
import { loadCase, saveCase, clearLocalStorage } from './functions';
import './style.scss';

class Home extends Component {
	state = {
		caseNo: '',
		trafficOffence: '',
		fine: '',
		deleteCaseNo: ''
	};

	handleForm = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	onFormSubmit = (event) => {
		event.preventDefault();
		const caseData = loadCase();
		const hasNoDuplicate = caseData.every((data) => data.caseNo !== this.state.caseNo.trim()); // Every : Iterates through each array element and returns a single true/false based on callback condition, stops executing immediately upon encountering false
		const isFormEmpty = this.state.caseNo === '' || this.state.trafficOffence === '' || this.state.fine === '';

		console.log('No Duplicate Found :', hasNoDuplicate); // Clarification of Every
		if (hasNoDuplicate && !isFormEmpty) {
			caseData.unshift({
				caseNo: this.state.caseNo.trim(),
				trafficOffence: this.state.trafficOffence.trim(),
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
		console.log('Works');
		const renderCases = loadCase().map((data) => (
			<div key={data.caseNo}>
				<h3>
					{data.caseNo} : {data.trafficOffence} : {data.fine}
				</h3>
			</div>
		));

		return (
			<div>
				<h1>CASE INFO</h1>
				{renderCases}
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
						<input
							type="text"
							placeholder="Traffic Offence"
							name="trafficOffence"
							onChange={this.handleForm}
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
				<br />
				<br />
				<Fragment>{this.printCaseJSON()}</Fragment>
			</div>
		);
	}
}

export default Home;
