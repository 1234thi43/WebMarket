import { Table } from '../../components/UI/table/Table';
import { Select } from '../../components/UI/select/Select';
import { Button } from '../../components/UI/button/Button';
import { DropdownMenu } from '../../components/UI/dropdown-menu/DropdownMenu';

export const UsersTable = ({ users, roles, onRoleChange, onSaveRole, onDelete }) => (
	<Table>
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
			{users.map((user) => {
				const isChanged = user.selectedRole !== user.role;
				return (
					<tr key={user._id}>
						<td>{user.name}</td>
						<td>{user.email}</td>
						<td>{new Date(user.createdAt).toLocaleDateString()}</td>
						<td>
							<Select
								value={user.selectedRole}
								onChange={(e) => onRoleChange(user._id, e.target.value)}
							>
								{roles.map((r) => (
									<option key={r.id} value={r.id}>
										{r.name}
									</option>
								))}
							</Select>
							<Button
								onClick={() => onSaveRole(user._id, user.selectedRole)}
								disabled={!isChanged}
								style={{ marginLeft: '5px' }}
							>
								💾
							</Button>
						</td>
						<td>
							<DropdownMenu
								items={[
									{
										label: 'Удалить',
										onClick: () => onDelete(user._id),
									},
								]}
							/>
						</td>
					</tr>
				);
			})}
		</tbody>
	</Table>
);
