import React, { Component, Fragment } from 'react';
import { saveCase } from './server';

class Modal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			id: this.props.caseData.id,
			caseNo: this.props.caseData.caseNo,
			trafficOffence: this.props.caseData.trafficOffence,
			description: this.props.caseData.description,
			fine: this.props.caseData.fine
		};
	}

	onFormSubmit = (event) => {
		event.preventDefault();

		const isFormEmpty =
			this.state.caseNo === '' ||
			this.state.trafficOffence === '' ||
			this.state.description === '' ||
			this.state.fine === '';

		const invalidFineAndCaseNumber =
			Number.isNaN(Number(this.state.caseNo.trim())) || Number.isNaN(Number(this.state.fine.trim()));

		if (!isFormEmpty && !invalidFineAndCaseNumber) {
			this.createCase(
				{
					id: this.state.id,
					caseNo: this.state.caseNo.trim(),
					trafficOffence: this.state.trafficOffence.trim(),
					description: this.state.description.trim(),
					fine: this.state.fine.trim()
				},
				'updateCase'
			);
			this.props.closeModal();
			console.log('search and Delete redirection: ', this.state.redirection);
		}
	};

	createCase = (data, operation) => {
		console.log('createCase', operation);

		const queryCall = saveCase(data, operation);

		queryCall
			.then((data) => {
				console.log('Success mutating data');

				this.props.renderCase();
			})
			.catch((err) => {
				'Something went wrong mutating data';
			});
	};

	handleForm = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	render() {
		console.log('Render', this.props);

		return (
			<div className="Form" onDoubleClick={this.props.closeModal}>
				<Fragment>
					<main>
						<h1>Edit Modal (Double Click to close Modal)</h1>
					</main>
				</Fragment>
				<br />
				<br />
				<br />
				<br />
				<Fragment>
					<form>
						<input
							type="text"
							placeholder="Case No."
							name="caseNo"
							onChange={this.handleForm}
							value={this.state.caseNo}
							required
						/>
						<br />
						<br />
						<textarea
							name="trafficOffence"
							placeholder="Traffic Offence"
							onChange={this.handleForm}
							rows="5"
							cols="33"
							value={this.state.trafficOffence}
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
							value={this.state.description}
							required
						/>
						<br />
						<br />
						<input
							type="text"
							placeholder="Fine"
							name="fine"
							onChange={this.handleForm}
							value={this.state.fine}
							required
						/>
						<button onClick={this.onFormSubmit}>Submit Case</button>
					</form>
				</Fragment>
			</div>
		);
	}
}

export default Modal;
