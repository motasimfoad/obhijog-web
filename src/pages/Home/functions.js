import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('https://api.graph.cool/simple/v1/cjuvnbmub0zij0176xcsvoni9', {
	headers: {
		Authorization: 'Bearer YOUR_AUTH_TOKEN'
	}
});

const loadCase = () => {
	let cases = [];
	const response = client.request(`
		query{
			allCases{
				id
				caseNo
				trafficOffence
				description
				fine
			}
		}
	`);
	return response;
};

const saveCase = (dataJSON) => {
	localStorage.setItem('case', JSON.stringify(dataJSON));
};

const clearLocalStorage = () => {
	const userConfirmation = window.confirm('Are you Sure?');
	if (userConfirmation) {
		localStorage.clear();
		window.location.reload();
	}
};

const sortCaseAndSave = () => {
	const caseData = loadCase();

	// sorting caseData in Ascending Order
	caseData.sort((a, b) => {
		const firstCaseNum = Number(a.caseNo);
		const secondCaseNum = Number(b.caseNo);

		if (firstCaseNum < secondCaseNum) {
			return -1; // return a
		} else if (firstCaseNum > secondCaseNum) {
			return 1; // return b
		} else {
			return 0; // return any one of them
		}
	});

	saveCase(caseData);
	window.location.reload();
};

export { loadCase, saveCase, sortCaseAndSave, clearLocalStorage };
