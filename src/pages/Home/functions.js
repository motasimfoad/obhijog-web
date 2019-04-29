const loadCase = () => {
	if (localStorage.getItem('case') === null) {
		return [];
	} else {
		return JSON.parse(localStorage.getItem('case'));
	}
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

export { loadCase, saveCase, clearLocalStorage };
