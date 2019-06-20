import React, { Component } from 'react';
import { saveCase } from './server';

// <Form createCase = {this.createCase.bind(this)} caseState = {this.state}/>

class Form extends Component {
	state = {
		caseNo: '',
		trafficOffence: '',
		description: '',
		fine: '',
		capturedCases: this.props.caseState.capturedCases
	};

	createCase = (data, operation) => {
		const queryCall = saveCase(data, operation);

		queryCall
			.then((data) => {
				console.log('Success mutating data');

				this.props.renderCase();
			})
			.catch((err) => {
				console.log('Something went wrong mutating data');
			});
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

		if (hasNoDuplicate && !isFormEmpty && !invalidFineAndCaseNumber) {
			this.createCase(
				{
					caseNo: this.state.caseNo.trim(),
					trafficOffence: this.state.trafficOffence.trim(),
					description: this.state.description.trim(),
					fine: this.state.fine.trim()
				},
				'createCase'
			);
		}
	};

	render() {
		return (
			<div className="Form">
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
			</div>
		);
	}
}

export default Form;
