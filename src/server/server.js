import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('https://api.graph.cool/simple/v1/cjuvnbmub0zij0176xcsvoni9', {
	headers: {
		Authorization: 'Bearer YOUR_AUTH_TOKEN'
	}
});

const signUpAccount = (data) => {
	const response = client.request(`
			mutation {
				createUser(
					authProvider: {
						email: {
							email: "${data.email}"
							password: "${data.password}"
						}
					}
				) {
					email
					password
				}
			}
	`);

	return response;
};

const logInAccount = (data) => {
	const response = client.request(`
			mutation {
				signinUser(
					email: {
						email: "${data.email}"
						password: "${data.password}"
					}
				) {
					token
					user {
						id
						email
						password
					}
				}
			}
	`);

	return response;
};

const addASearch = (caseNumber, userID) => {
	const response = client.request(`
	mutation searchACase {
		createSearchedCase(
			caseNo: "${caseNumber}",
			userId: "${userID}"
		) {
			caseNo
			id
			createdAt
			user {
				id
				email
			}
		}
	}
  `);

	return response;
};

/* DO NOT DELETE: REFERENCE FOR FILTERING DATES

		query findDailyTrend {
			allSearchedCases(
				filter: {
					createdAt_gt: "2019-07-01T16:00:00.000Z",
					createdAt_lte: "2019-07-02T15:31:00.000Z" 
				}
				orderBy: createdAt_ASC
			){
			caseNo
			}
		}
	`
*/

const loadSearchCases = () => {
	const response = client.request(`
		query findDailyTrend {
			allSearchedCases(
				filter: {
					createdAt_gt: "2019-07-01T16:00:00.000Z"
				}
				orderBy: createdAt_ASC
			){
			caseNo
			}
		}
	`);

	return response;
};

const loadCase = () => {
	const response = client.request(`
		query{
			allCases(orderBy: caseNo_ASC) {
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

const saveCase = (data, operation) => {
	console.log('SaveCase which is currently doing the operation : ', operation);

	if (operation === 'createCase') {
		var response = client.request(`
			mutation {
				createCase(
					caseNo: "${data.caseNo}", 
					trafficOffence: "${data.trafficOffence}", 
					description: "${data.description}", 
					fine: "${data.fine}"
				) {
						id
						trafficOffence
						description
						fine
					}
				}`);
	} else if (operation === 'updateCase') {
		var response = client.request(`
			mutation {
				updateCase(
					id:"${data.id}", 
					caseNo:"${data.caseNo}", 
					trafficOffence:"${data.trafficOffence}", 
					description:"${data.description}", 
					fine: "${data.fine}"
				) {
						id
						trafficOffence
						description
						fine
					}
				}`);
	}

	return response;
};

const deleteCase = (deleteCaseNo) => {
	// ***********
	const response = loadCase()
		.then((data) => {
			console.log(`1st then, Searching Caseses matching with case no : ${deleteCaseNo} : `, data);

			const caseObj = data.allCases.find((obj) => {
				return obj.caseNo === deleteCaseNo;
			});

			if (!caseObj) {
				throw new Error('Case Number Not Found');
			}

			return caseObj;
		})
		.then((data) => {
			console.log('2nd then, Case Found, Retrieving the id and Now about to delete the case with caseID : ', data);

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
		.catch((err) => {
			console.log('Something went wrong while deleting case : ', err);
		});
	// ***********

	return response;
};

export { signUpAccount, logInAccount, loadCase, loadSearchCases, addASearch, saveCase, deleteCase };
