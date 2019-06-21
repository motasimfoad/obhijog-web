import React, { Component } from 'react';
import SingleCase from './SingleCase';

// <Caselist caseState= {this.state} />

class Caselist extends Component {
	render() {
		const caseArray = this.props.caseState.capturedCases.map((data) => {
			return <SingleCase data={data} setEditModal={this.props.setEditModal} caseState={this.props.caseState} />;
		});
		return (
			<div>
				<h1>CASE INFO</h1>
				{caseArray}
			</div>
		);
	}
}

export default Caselist;
