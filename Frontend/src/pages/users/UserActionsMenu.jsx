import { DropdownMenu } from '../../components/UI/dropdown-menu/DropdownMenu';

export const UserActionMenu = ({ onDelete }) => {
	const items = [
		{
			label: 'Удалить',
			onClick: onDelete,
		},
	];

	return <DropdownMenu items={items} />;
};
