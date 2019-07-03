import { loadSearchCases, addASearch, loadCase } from './server';

const fetchSearchedCases = async () => {
	try {
		const { allSearchedCases } = await loadSearchCases();
		const { allCases } = await loadCase();

		let temp = null;
		const topSearched = [];
		const countList = {};
		const countListArray = [];

		allSearchedCases.forEach((data) => {
			if (countList[data.caseNo] === undefined) {
				countList[data.caseNo] = 1;
			} else {
				countList[data.caseNo] += 1;
			}
		});

		for (let [ key, value ] of Object.entries(countList)) {
			countListArray.push({ caseNo: key, viewCount: value });
		}

		countListArray.sort((a, b) => {
			return b.viewCount - a.viewCount;
		});

		// console.log(totalSearched);
		// console.log(allCases);
		// console.log(countList);
		// console.log(countListArray);

		countListArray.forEach((data) => {
			temp = allCases.find((c) => data.caseNo === c.caseNo);
			if (temp) {
				topSearched.push(temp);
			}
		});

		// console.log(topSearched);
		return topSearched;
	} catch (error) {
		console.log(error);
		return false;
	}
};

const createSearchedCases = async (caseNumber) => {
	try {
		const { allCases } = await loadCase();
		const caseAvailable = allCases.some((c) => {
			return c.caseNo === caseNumber;
		});

		if (!caseAvailable) {
			return false;
		}

		const userID = JSON.parse(localStorage.getItem('auth')).id;
		return addASearch(caseNumber, userID);
	} catch (error) {
		console.log(error);
		return false;
	}
};

export { fetchSearchedCases, createSearchedCases };
