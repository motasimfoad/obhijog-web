import React, { Component } from 'react';

class SingleCase extends Component {
	render() {
		return (
			<div
				className="renderCaseMap"
				key={this.props.data.caseNo}
				onDoubleClick={() => {
					this.props.setEditModal({ ...this.props.data });
				}}
			>
				<h3>Case Number : {this.props.data.caseNo}</h3>
				<div>
					<h3>Traffic Offence : {this.props.data.trafficOffence}</h3>
				</div>
				<div>
					<h3>Description :</h3>
					<p> {this.props.data.description}</p>
				</div>
				<h3>Fine : {this.props.data.fine}</h3>
			</div>
		);
	}
}

export default SingleCase;
