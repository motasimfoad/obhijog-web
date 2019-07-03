import React, { Component } from 'react';
import { saveCase } from '../../server/server';

// <Form renderCase = {this.renderCase.bind(this)} caseState = {this.state}/>

class Form extends Component {
	state = {
		caseNo: '',
		trafficOffence: '',
		description: '',
		fine: ''
	};

	onFormSubmit = (event) => {
		event.preventDefault();

		const caseNo = this.state.caseNo.trim();
		const trafficOffence = this.state.trafficOffence.trim();
		const description = this.state.description.trim();
		const fine = this.state.fine.trim();

		const caseData = this.props.caseState.capturedCases;

		const hasNoDuplicate = caseData.every((data) => data.caseNo !== caseNo); // Every : Iterates through each array element and returns a single true/false based on callback condition, stops executing immediately upon encountering first false
		const isFormEmpty = caseNo === '' || trafficOffence === '' || description === '' || fine === '';
		const invalidFineAndCaseNumber = Number.isNaN(Number(caseNo)) || Number.isNaN(Number(fine));

		if (hasNoDuplicate && !isFormEmpty && !invalidFineAndCaseNumber) {
			this.createCase({
				caseNo,
				trafficOffence,
				description,
				fine
			});
		}
	};

	createCase = (data) => {
		console.log('createCase running');

		const queryCall = saveCase(data, 'createCase');

		queryCall
			.then((data) => {
				console.log('Success creating case');
				this.props.renderCase();
			})
			.catch((err) => {
				console.log('Something went wrong while creating case', err);
			});
	};

	handleForm = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
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
