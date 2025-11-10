// import styled from 'styled-components';
// import { useEffect, useState } from 'react';
// import { ROLE } from '../../constants/role';
// import { useSelector } from 'react-redux';
// import { selectRole } from '../../slices/authSlice';
// import { request } from '../../utils/request';
// import { useModal } from '../../components/common/modal/modal-context';
// import { useNotification } from '../../components/common/notification/useNotification';
// import Loader from '../../components/common/loader/loader';
// import { UserActionMenu } from './UserActionsMenu';
// import { Select } from '../../components';
// import { Button } from '../../components';
// import { URL } from '../../constants/url';

// const UsersContainer = ({ className }) => {
// 	const [roles, setRoles] = useState([]);
// 	const [users, setUsers] = useState([]);
// 	const [errorMessage, setErrorMessage] = useState(null);
// 	const [loading, setLoading] = useState(true);
// 	const userRole = useSelector(selectRole);
// 	const { openModal } = useModal();
// 	const { showNotification } = useNotification();

// 	useEffect(() => {
// 		if (userRole !== ROLE.ADMIN) return;

// 		setLoading(true);
// 		Promise.all([
// 			// request('http://localhost:5000/api/users', 'GET'),
// 			request(`${URL}/api/users`, 'GET'),
// 			// request('http://localhost:5000/api/users/roles', 'GET'),
// 			request(`${URL}/api/users/roles`, 'GET'),
// 		])
// 			.then(([usersRes, rolesRes]) => {
// 				if (usersRes.error || rolesRes.error) {
// 					setErrorMessage(usersRes.error || rolesRes.error);
// 					return;
// 				}
// 				setUsers(usersRes.data.map((u) => ({ ...u, selectedRole: u.role })));
// 				setRoles(rolesRes.data);
// 			})
// 			.catch((err) => setErrorMessage(err.message))
// 			.finally(() => setLoading(false));
// 	}, [userRole]);

// 	const updateUserRoleOnServer = async (id, newRole) => {
// 		setLoading(true);
// 		try {
// 			// const res = await request(`http://localhost:5000/api/users/${id}`, 'PATCH', {
// 			const res = await request(`${URL}/api/users/${id}`, 'PATCH', {
// 				role: newRole,
// 			});
// 			if (res.error) {
// 				showNotification('❌ Ошибка при изменении роли: ' + res.error, 'red');
// 				return;
// 			}
// 			setUsers((prev) =>
// 				prev.map((u) =>
// 					u._id === id ? { ...u, role: newRole, selectedRole: newRole } : u,
// 				),
// 			);
// 			showNotification('✅ Роль пользователя успешно изменена', 'green');
// 		} catch (err) {
// 			console.error('Ошибка при изменении роли:', err);
// 			showNotification('❌ Ошибка сети при изменении роли', 'red');
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	const handleRoleChange = (id, value) => {
// 		setUsers((prev) =>
// 			prev.map((u) => (u._id === id ? { ...u, selectedRole: Number(value) } : u)),
// 		);
// 	};

// 	const handleDeleteUser = (id) => {
// 		openModal({
// 			text: 'Вы действительно хотите удалить пользователя?',
// 			onConfirm: async () => {
// 				setLoading(true);
// 				try {
// 					const res = await request(
// 						// `http://localhost:5000/api/users/${id}`,
// 						`${URL}/api/users/${id}`,
// 						'DELETE',
// 					);
// 					if (res.error) {
// 						showNotification('❌ Ошибка при удалении: ' + res.error, 'red');
// 						return;
// 					}
// 					setUsers((prev) => prev.filter((u) => u._id !== id));
// 					showNotification('✅ Пользователь успешно удалён', 'green');
// 				} catch (err) {
// 					console.error('Ошибка при удалении:', err);
// 					showNotification('❌ Ошибка сети при удалении пользователя', 'red');
// 				} finally {
// 					setLoading(false);
// 				}
// 			},
// 		});
// 	};

// 	if (userRole !== ROLE.ADMIN) return <div>⛔ Доступ запрещён</div>;

// 	if (loading) return <Loader />;

// 	return (
// 		<div className={className}>
// 			<h2>Пользователи</h2>
// 			{errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
// 			<table>
// 				<thead>
// 					<tr>
// 						<th>Имя</th>
// 						<th>Email</th>
// 						<th>Дата регистрации</th>
// 						<th>Роль</th>
// 						<th>Действия</th>
// 					</tr>
// 				</thead>
// 				<tbody>
// 					{users.map((user) => {
// 						const isChanged = user.selectedRole !== user.role;
// 						return (
// 							<tr key={user._id}>
// 								<td>{user.name}</td>
// 								<td>{user.email}</td>
// 								<td>{new Date(user.createdAt).toLocaleDateString()}</td>
// 								<td>
// 									<Select
// 										value={user.selectedRole}
// 										onChange={(e) =>
// 											handleRoleChange(user._id, e.target.value)
// 										}
// 									>
// 										{roles
// 											.filter((r) => r.id !== ROLE.GUEST)
// 											.map((r) => (
// 												<option key={r.id} value={r.id}>
// 													{r.name}
// 												</option>
// 											))}
// 									</Select>
// 									<Button
// 										onClick={() =>
// 											updateUserRoleOnServer(
// 												user._id,
// 												user.selectedRole,
// 											)
// 										}
// 										disabled={!isChanged}
// 										style={{ marginLeft: '8px' }}
// 									>
// 										💾
// 									</Button>
// 								</td>
// 								<td>
// 									<UserActionMenu
// 										onDelete={() => handleDeleteUser(user._id)}
// 									/>
// 								</td>
// 							</tr>
// 						);
// 					})}
// 				</tbody>
// 			</table>
// 		</div>
// 	);
// };

// export const Users = styled(UsersContainer)`
// 	width: 80%;
// 	margin: 100px auto;

// 	h2 {
// 		margin-bottom: 20px;
// 	}

// 	table {
// 		width: 100%;
// 		border-collapse: collapse;
// 	}

// 	th,
// 	td {
// 		border: 1px solid #ccc;
// 		padding: 8px;
// 		text-align: left;
// 	}

// 	button {
// 		cursor: pointer;
// 	}

// 	select {
// 		padding: 3px 5px;
// 	}
// `;

// export default Users;

import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { ROLE } from '../../constants/role';
import { useSelector } from 'react-redux';
import { selectRole, selectToken } from '../../slices/authSlice';
import { request } from '../../utils/request';
import { useModal } from '../../components/common/modal/modal-context';
import { useNotification } from '../../components/common/notification/useNotification';
import Loader from '../../components/common/loader/loader';
import { UserActionMenu } from './UserActionsMenu';
import { Select } from '../../components';
import { Button } from '../../components';
import { URL } from '../../constants/url';

const UsersContainer = ({ className }) => {
	const [roles, setRoles] = useState([]);
	const [users, setUsers] = useState([]);
	const [errorMessage, setErrorMessage] = useState(null);
	const [loading, setLoading] = useState(true);

	const userRole = useSelector(selectRole);
	const token = useSelector(selectToken);
	const { openModal } = useModal();
	const { showNotification } = useNotification();

	useEffect(() => {
		if (userRole !== ROLE.ADMIN || !token) return;

		setLoading(true);

		Promise.all([
			request(`${URL}/api/users`, 'GET', null, token),
			request(`${URL}/api/users/roles`, 'GET', null, token),
		])
			.then(([usersRes, rolesRes]) => {
				if (usersRes.error || rolesRes.error) {
					setErrorMessage(usersRes.error || rolesRes.error);
					return;
				}
				setUsers(usersRes.data.map((u) => ({ ...u, selectedRole: u.role })));
				setRoles(rolesRes.data);
			})
			.catch((err) => setErrorMessage(err.message))
			.finally(() => setLoading(false));
	}, [userRole, token]);

	const updateUserRoleOnServer = async (id, newRole) => {
		setLoading(true);
		try {
			const res = await request(
				`${URL}/api/users/${id}`,
				'PATCH',
				{ role: newRole },
				token,
			);
			if (res.error) {
				showNotification('❌ Ошибка при изменении роли: ' + res.error, 'red');
				return;
			}
			setUsers((prev) =>
				prev.map((u) =>
					u._id === id ? { ...u, role: newRole, selectedRole: newRole } : u,
				),
			);
			showNotification('✅ Роль пользователя успешно изменена', 'green');
		} catch (err) {
			console.error('Ошибка при изменении роли:', err);
			showNotification('❌ Ошибка сети при изменении роли', 'red');
		} finally {
			setLoading(false);
		}
	};

	const handleRoleChange = (id, value) => {
		setUsers((prev) =>
			prev.map((u) => (u._id === id ? { ...u, selectedRole: Number(value) } : u)),
		);
	};

	const handleDeleteUser = (id) => {
		openModal({
			text: 'Вы действительно хотите удалить пользователя?',
			onConfirm: async () => {
				setLoading(true);
				try {
					const res = await request(
						`${URL}/api/users/${id}`,
						'DELETE',
						null,
						token,
					);
					if (res.error) {
						showNotification('❌ Ошибка при удалении: ' + res.error, 'red');
						return;
					}
					setUsers((prev) => prev.filter((u) => u._id !== id));
					showNotification('✅ Пользователь успешно удалён', 'green');
				} catch (err) {
					console.error('Ошибка при удалении:', err);
					showNotification('❌ Ошибка сети при удалении пользователя', 'red');
				} finally {
					setLoading(false);
				}
			},
		});
	};

	if (userRole !== ROLE.ADMIN) return <div>⛔ Доступ запрещён</div>;
	if (loading) return <Loader />;

	// const totalPages = Math.ceil(users.length / 5);
	const startIndex = 0;
	const currentItems = users.slice(startIndex, startIndex + 5);

	return (
		<div className={className}>
			<h2>Пользователи</h2>
			{errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
			<table>
				<thead>
					<tr>
						<th>Имя</th>
						<th>Email</th>
						<th>Дата регистрации</th>
						<th>Роль</th>
						<th>Действия</th>
					</tr>
				</thead>
				<tbody>
					{currentItems.map((user) => {
						const isChanged = user.selectedRole !== user.role;
						return (
							<tr key={user._id}>
								<td>{user.name}</td>
								<td>{user.email}</td>
								<td>{new Date(user.createdAt).toLocaleDateString()}</td>
								<td>
									<Select
										value={user.selectedRole}
										onChange={(e) =>
											handleRoleChange(user._id, e.target.value)
										}
									>
										{roles
											.filter((r) => r.id !== ROLE.GUEST)
											.map((r) => (
												<option key={r.id} value={r.id}>
													{r.name}
												</option>
											))}
									</Select>
									<Button
										onClick={() =>
											updateUserRoleOnServer(
												user._id,
												user.selectedRole,
											)
										}
										disabled={!isChanged}
										style={{ marginLeft: '8px' }}
									>
										💾
									</Button>
								</td>
								<td>
									<UserActionMenu
										onDelete={() => handleDeleteUser(user._id)}
									/>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export const Users = styled(UsersContainer)`
	width: 80%;
	margin: 100px auto;

	h2 {
		margin-bottom: 20px;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th,
	td {
		border: 1px solid #ccc;
		padding: 8px;
		text-align: left;
	}

	button {
		cursor: pointer;
	}

	select {
		padding: 3px 5px;
	}
`;

export default Users;
