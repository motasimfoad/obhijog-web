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
	let cases = [];

	const response = client.request(`
	mutation {
		createCase(caseNo: "${dataJSON.caseNo}", trafficOffence: "${dataJSON.trafficOffence}", description: "${dataJSON.description}", fine: "${dataJSON.fine}") {
			id
			trafficOffence
			description
			fine
		}
		}
`);
	return response;
};

const deleteCase = (deleteCaseNo) => {
	let cases = [];
	console.log(deleteCaseNo);

	return loadCase()
		.then((data) => {
			console.log('1st then : ', data);
			console.log(data.allCases);
			const caseObj = data.allCases.find((obj) => {
				return obj.caseNo === deleteCaseNo;
			});

			if (caseObj) {
				return caseObj;
			}
			return 'Not Found';
		})
		.then((data) => {
			if (typeof data === 'string') {
				return;
			}
			console.log(data.id, data.caseNo);
			console.log('2nd then : ', data);

			return client.request(`
			mutation {
				deleteCase(id: "${data.id}"){
					id
					caseNo
					trafficOffence
					description
					fine
				}
			}`);
		})
		.then((data) => {
			console.log('Success');
			return data;
		})
		.catch((err) => {
			console.log(err);
		});
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

export { loadCase, saveCase, deleteCase, sortCaseAndSave, clearLocalStorage };
