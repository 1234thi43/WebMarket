import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../slices/authSlice';
import { request } from '../utils/request';
// import { useNavigate } from 'react-router';

export const AuthAutoLoader = () => {
	const dispatch = useDispatch();
	// const navigate = useNavigate();

	useEffect(() => {
		async function fetchCurrentUser() {
			try {
				const res = await request(
					'http://localhost:5000/api/users/me',
					'GET',
					null,
					{
						credentials: 'include',
					},
				);

				if (res.success) {
					dispatch(
						setUser({
							user: res.user,
							token: null,
						}),
					);
				}

				// navigate('/', { replace: true });
			} catch (err) {
				console.log('Авто-логин не прошёл:', err);
			}
		}

		fetchCurrentUser();
	}, [dispatch]);

	return null;
};
