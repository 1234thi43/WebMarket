import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../slices/cartSlice';
import { CATEGORIES } from '../../constants/categories';
import Loader from '../../components/common/loader/loader';
import { FormWrapper } from '../../components';
import { Button } from '../../components';

const Image = styled.img`
	width: 300px;
	height: 300px;
	object-fit: cover;
	border-radius: 8px;
`;

const Row = styled.div`
	display: flex;
	gap: 12px;
	align-items: center;
`;

export default function ProductDetails() {
	const { id } = useParams();
	const [product, setProduct] = useState(null);
	const [quantity, setQuantity] = useState(1);
	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch();

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				const res = await fetch(`http://localhost:5000/api/products/${id}`);
				const data = await res.json();
				if (data.success) setProduct(data.product);
			} catch (err) {
				console.error('Ошибка при загрузке товара:', err);
			} finally {
				setLoading(false);
			}
		})();
	}, [id]);

	if (loading) return <Loader />;

	if (!product) return <p>❌ Товар не найден</p>;

	const handleAddToCart = () => {
		dispatch(addToCart({ product, quantity: Number(quantity) }));
	};

	const isUnavailable = !product.isActive || product.quantity <= 0;

	return (
		<FormWrapper>
			<h2>{product.title}</h2>

			<Row>
				<Image
					src={product.image ? `http://localhost:5000${product.image}` : ''}
					alt={product.title}
				/>
				<div>
					<p>
						<strong>Категория:</strong>{' '}
						{CATEGORIES.find((c) => c.value === product.category)?.label ||
							product.category}
					</p>
					<p>
						<strong>Описание:</strong> {product.description}
					</p>
					<p>
						<strong>Цена:</strong> {product.price} ₽
					</p>
					<p>
						<strong>Доступно:</strong>{' '}
						{product.quantity > 0
							? `${product.quantity} шт.`
							: 'Нет в наличии'}
					</p>

					<Row style={{ marginTop: 12 }}>
						<input
							type="number"
							min="1"
							value={quantity}
							onChange={(e) => setQuantity(e.target.value)}
							style={{ width: 60, padding: 6 }}
							disabled={isUnavailable}
						/>

						<Button
							type="button"
							onClick={handleAddToCart}
							disabled={isUnavailable}
						>
							{isUnavailable ? 'Товар недоступен' : 'Добавить в корзину'}
						</Button>
					</Row>
				</div>
			</Row>
		</FormWrapper>
	);
}
