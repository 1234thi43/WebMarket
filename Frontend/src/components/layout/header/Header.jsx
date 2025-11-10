import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../slices/authSlice';
import { ROLE_LABELS, ROLE } from '../../../constants/role';
import { selectCart } from '../../../slices/cartSlice';

const HeaderComponent = ({ className }) => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.auth.user);
	const role = user?.role ?? ROLE.GUEST;
	const cart = useSelector(selectCart);

	const totalCount = cart.reduce((s, it) => s + (it.quantity || 1), 0);

	return (
		<div className={className}>
			<div>
				<Link to="/">Главная</Link>
				{role === ROLE.ADMIN && <Link to="/users">Пользователи</Link>}

				{[ROLE.ADMIN, ROLE.SELLER].includes(role) && (
					<Link to="/product">Товар</Link>
				)}

				<Link
					to="/cart"
					style={{ position: 'relative', display: 'inline-block' }}
				>
					Корзина
					{totalCount > 0 && (
						<span
							style={{
								position: 'absolute',
								top: -6,
								right: -10,
								background: 'red',
								color: 'white',
								borderRadius: '50%',
								width: 20,
								height: 20,
								fontSize: 12,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							{totalCount}
						</span>
					)}
				</Link>
			</div>

			<div>
				{user ? (
					<>
						<span>
							{user.name} ({ROLE_LABELS[role]})
						</span>
						<button
							onClick={() => dispatch(logout())}
							style={{ marginLeft: '10px' }}
						>
							Выйти
						</button>
					</>
				) : (
					<>
						<span>Гость</span>
						<Link to="/login">Вход</Link>
						<Link to="/register">Регистрация</Link>
					</>
				)}
			</div>
		</div>
	);
};

export const Header = styled(HeaderComponent)`
	position: fixed;
	top: 0;
	width: calc(1200px - 20px);
	background: #dad8d8;
	color: black;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 60px;
	gap: 20px;
	padding: 10px;
	a {
		color: black;
		text-decoration: none;
		font-weight: bold;
		margin: 0 15px;
	}
`;

