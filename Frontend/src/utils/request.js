export async function request(url, method = 'GET', data = null, token = null) {
	const options = {
		method,
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	};

	if (token) {
		options.headers.Authorization = `Bearer ${token}`;
	}

	if (data && method !== 'GET') {
		options.body = JSON.stringify(data);
	}

	try {
		const response = await fetch(url, options);

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`HTTP ${response.status}: ${errorText}`);
		}

		const contentType = response.headers.get('content-type');
		if (contentType && contentType.includes('application/json')) {
			return await response.json();
		} else {
			return await response.text();
		}
	} catch (err) {
		console.error('Request error:', err);
		throw err;
	}
}
