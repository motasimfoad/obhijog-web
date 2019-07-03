import React, { Component } from 'react';

// <SingleCase data={data} setEditModal={this.props.setEditModal} caseState={this.props.caseState} />

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
					<h3> {this.props.data.description}</h3>
				</div>
				<h3>Fine : {this.props.data.fine}</h3>
			</div>
		);
	}
}

export default SingleCase;
