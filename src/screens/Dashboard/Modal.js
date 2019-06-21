import React, { Component, Fragment } from 'react';
import { saveCase } from '../../server/server';

// <Modal caseData={this.state.editCaseDatas} closeModal={this.closeModal} renderCase={this.renderCase} />

class Modal extends Component {
	state = {
		id: this.props.caseData.id,
		caseNo: this.props.caseData.caseNo,
		trafficOffence: this.props.caseData.trafficOffence,
		description: this.props.caseData.description,
		fine: this.props.caseData.fine
	};

	onFormSubmit = (event) => {
		event.preventDefault();

		const caseNo = this.state.caseNo.trim();
		const trafficOffence = this.state.trafficOffence.trim();
		const description = this.state.description.trim();
		const fine = this.state.fine.trim();

		const isFormEmpty = caseNo === '' || trafficOffence === '' || description === '' || fine === '';
		const invalidFineAndCaseNumber = Number.isNaN(Number(caseNo)) || Number.isNaN(Number(fine));

		if (!isFormEmpty && !invalidFineAndCaseNumber) {
			this.updateCase({
				id: this.state.id,
				caseNo,
				trafficOffence,
				description,
				fine
			});
			this.props.closeModal();
		}
	};

	updateCase = (data) => {
		console.log('updateCase running');

		const queryCall = saveCase(data, 'updateCase');

		queryCall
			.then((data) => {
				console.log('Success updating case');
				this.props.renderCase();
			})
			.catch((err) => {
				console.log('Something went wrong while updating case', err);
			});
	};

	handleForm = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	render() {
		return (
			<div className="Modal" onDoubleClick={this.props.closeModal}>
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
