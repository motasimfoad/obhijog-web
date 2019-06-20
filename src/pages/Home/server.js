import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('https://api.graph.cool/simple/v1/cjuvnbmub0zij0176xcsvoni9', {
	headers: {
		Authorization: 'Bearer YOUR_AUTH_TOKEN'
	}
});

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

const saveCase = (dataJSON, operation) => {
	console.log('SaveCase', operation);

	if (operation === 'createCase') {
		var response = client.request(`
    mutation {
      createCase(caseNo: "${dataJSON.caseNo}", trafficOffence: "${dataJSON.trafficOffence}", description: "${dataJSON.description}", fine: "${dataJSON.fine}") {
        id
        trafficOffence
        description
        fine
      }
    }
`);
	} else if (operation === 'updateCase') {
		var response = client.request(`
    mutation {
			updateCase(id:"${dataJSON.id}", caseNo:"${dataJSON.caseNo}", 
				trafficOffence:"${dataJSON.trafficOffence}", 
				description:"${dataJSON.description}", 
				fine: "${dataJSON.fine}"
			) {
					id
					trafficOffence
					description
					fine
			}
  	}
  `);
	}

	return response;
};

const deleteCase = (deleteCaseNo) => {
	return loadCase()
		.then((data) => {
			console.log(`1st then, Searching Caseses matching with ${deleteCaseNo}: `, data);

			const caseObj = data.allCases.find((obj) => {
				return obj.caseNo === deleteCaseNo;
			});

			if (caseObj) {
				return caseObj;
			}
			return 'CaseNo Not Found';
		})
		.then((data) => {
			if (typeof data === 'string') {
				console.log('2nd then, Case not Found : ', data);
				return data;
			}

			console.log('2nd then, Case Found, Retrieving the id and Now about to delete the case with caseID: ', data);

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
			console.log('3rd then, Final result :', data);

			return data;
		})
		.catch((err) => {
			console.log(err);
		});
};

export { loadCase, saveCase, deleteCase };
