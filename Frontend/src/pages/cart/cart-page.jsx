import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectCart,
	removeFromCart,
	setQuantity,
	clearCart,
} from '../../slices/cartSlice';
import { useModal } from '../../components/common/modal/modal-context';
import { ROLE } from '../../constants/role';
import { useNotification } from '../../components/common/notification/useNotification';
import { Button } from '../../components';
import { Input } from '../../components';

const Container = styled.div`
	max-width: 900px;
	margin: 0 auto;
	padding: 20px;
	background: #fffdf7;
	border: 1px solid #e0cfa5;
	border-radius: 8px;
`;

const Row = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 12px;
	padding: 10px 0;
	border-bottom: 1px solid #eee;
`;

const ProductBlock = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

const Img = styled.img`
	width: 80px;
	height: 80px;
	object-fit: cover;
	border-radius: 6px;
	background-color: #f4e8d0;
`;

const Controls = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

const Summary = styled.div`
	display: flex;
	justify-content: space-between;
	margin-top: 16px;
	align-items: center;
`;

export default function CartPage() {
	const cart = useSelector(selectCart);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { openModal } = useModal();
	const { showNotification } = useNotification();
	const user = useSelector((state) => state.auth.user);
	const role = user?.role ?? ROLE.GUEST;

	const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

	const handlePay = () => {
		if (role === ROLE.GUEST) {
			openModal({
				text: 'Чтобы оплатить заказ, пожалуйста, зарегистрируйтесь или войдите в систему.',
				onConfirm: () => navigate('/register'),
			});
			return;
		}

		openModal({
			text: `Оплатить ${total} ₽ за ${cart.length} товар(ов)?`,
			onConfirm: () => {
				dispatch(clearCart());
				showNotification('✅ Оплата прошла успешно!', 'green');
				navigate('/');
			},
		});
	};

	return (
		<Container>
			<h2>Корзина</h2>

			{cart.length === 0 ? (
				<p>Пока в корзине ничего нет.</p>
			) : (
				<>
					{cart.map((p) => (
						<Row key={p._id}>
							<ProductBlock>
								<Img
									src={p.image ? `http://localhost:5000${p.image}` : ''}
									alt={p.title}
								/>
								<div>
									<div>
										<strong>{p.title}</strong>
									</div>
									<div>Цена: {p.price} ₽</div>
								</div>
							</ProductBlock>

							<Controls>
								<Input
									type="number"
									min="1"
									value={p.quantity || 1}
									onChange={(e) =>
										dispatch(
											setQuantity({
												id: p._id,
												quantity: e.target.value,
											}),
										)
									}
									style={{ width: 60, padding: 6 }}
								/>
								<Button
									$variant="danger"
									onClick={() => dispatch(removeFromCart(p._id))}
								>
									Удалить
								</Button>
							</Controls>
						</Row>
					))}

					<Summary>
						<div>
							<strong>Итого:</strong> {total} ₽
						</div>
						<div style={{ display: 'flex', gap: 8 }}>
							<Button
								$variant="danger"
								onClick={() =>
									openModal({
										text: 'Очистить корзину?',
										onConfirm: () => dispatch(clearCart()),
									})
								}
							>
								Очистить
							</Button>
							<Button $variant="success" onClick={handlePay}>
								Оплатить
							</Button>
						</div>
					</Summary>
				</>
			)}
		</Container>
	);
}
