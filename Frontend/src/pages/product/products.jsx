import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { ROLE } from '../../constants/role';
import { useModal } from '../../components/common/modal/modal-context';
import { CATEGORIES } from '../../constants/categories';
import Loader from '../../components/common/loader/loader';
import { useNotification } from '../../components/common/notification/useNotification';

import { FormWrapper } from '../../components';
import { Table } from '../../components';
import { Button } from '../../components';
import { Label } from '../../components';
import { Input } from '../../components';
import { URL } from '../../constants/url';

const Wrapper = styled.div`
	display: flex;
	gap: 30px;
	padding: 40px;
	align-items: flex-start;
`;

const StatusTd = styled.td`
	width: 150px;
`;

const PhotoTd = styled.td`
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 120px;
`;

export default function ProductPage() {
	const user = useSelector((state) => state.auth.user);
	const { openModal } = useModal();
	const { showNotification } = useNotification();

	const [form, setForm] = useState({
		title: '',
		category: '',
		price: '',
		description: '',
		image: null,
	});
	const [products, setProducts] = useState([]);
	const [editingId, setEditingId] = useState(null);
	const [loading, setLoading] = useState(false);

	const role = user?.role ?? ROLE.GUEST;
	const userId = user?.id || user?._id;

	useEffect(() => {
		if (!userId) return;

		const fetchProducts = async () => {
			setLoading(true);
			try {
				const res = await fetch(
					// `http://localhost:5000/api/products/user/${userId}`,
					`${URL}/api/products/user/${userId}`,
					{ credentials: 'include', cache: 'no-store' },
				);
				const data = await res.json();
				if (data.success) setProducts(data.products);
				else setProducts([]);
			} catch (err) {
				console.error('Ошибка при загрузке товаров:', err);
				showNotification('❌ Не удалось загрузить товары', 'red');
			} finally {
				setLoading(false);
			}
		};
		fetchProducts();
	}, [userId]);

	if (![ROLE.ADMIN, ROLE.SELLER].includes(role)) {
		return <div style={{ padding: 40 }}>❌ У вас нет доступа к этой странице</div>;
	}

	const handleChange = (e) => {
		const { name, value, files } = e.target;
		setForm({ ...form, [name]: files ? files[0] : value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formData = new FormData();
		for (const [key, val] of Object.entries(form)) {
			if (key === 'image' && !val) continue;
			formData.append(key, val);
		}
		formData.append('userId', userId);

		if (editingId) {
			openModal({
				text: 'Сохранить изменения этого товара?',
				onConfirm: async () => await saveProduct(formData, true),
			});
		} else {
			await saveProduct(formData, false);
		}
	};

	const saveProduct = async (formData, isEdit) => {
		setLoading(true);
		try {
			// let url = 'http://localhost:5000/api/products';
			let url = `${URL}/api/products`;
			let method = 'POST';
			if (isEdit) {
				url += `/${editingId}`;
				method = 'PUT';
			}

			const res = await fetch(url, {
				method,
				body: formData,
				credentials: 'include',
			});
			const data = await res.json();

			if (data.success) {
				if (isEdit) {
					setProducts((prev) =>
						prev.map((p) => (p._id === editingId ? data.product : p)),
					);
					showNotification('✅ Товар успешно отредактирован!', 'green');
					setEditingId(null);
				} else {
					setProducts((prev) => [...prev, data.product]);
					showNotification('✅ Товар успешно добавлен!', 'green');
				}
				setForm({
					title: '',
					category: '',
					price: '',
					description: '',
					image: null,
				});
			} else {
				showNotification(
					'❌ Ошибка при сохранении товара: ' + (data.message || 'unknown'),
					'red',
				);
			}
		} catch (err) {
			console.error('Ошибка отправки формы:', err);
			showNotification('❌ Ошибка сети при сохранении товара', 'red');
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = (id) => {
		openModal({
			text: 'Вы действительно хотите удалить этот товар?',
			onConfirm: async () => {
				setLoading(true);
				try {
					// const res = await fetch(`http://localhost:5000/api/products/${id}`, {
					const res = await fetch(`${URL}/api/products/${id}`, {
						method: 'DELETE',
						credentials: 'include',
					});
					const data = await res.json();
					if (data.success) {
						setProducts((prev) => prev.filter((p) => p._id !== id));
						showNotification('✅ Товар удалён', 'green');
					} else {
						showNotification(
							'❌ Ошибка при удалении: ' + (data.message || 'unknown'),
							'red',
						);
					}
				} catch (err) {
					console.error('Ошибка при удалении товара:', err);
					showNotification('❌ Ошибка сети при удалении товара', 'red');
				} finally {
					setLoading(false);
				}
			},
		});
	};

	const handleEdit = (product) => {
		setForm({
			title: product.title,
			category: product.category,
			price: product.price,
			description: product.description,
			image: null,
		});
		setEditingId(product._id);
	};

	const toggleProductActive = async (id) => {
		setLoading(true);
		try {
			// const res = await fetch(`http://localhost:5000/api/products/${id}/toggle`, {
			const res = await fetch(`${URL}/api/products/${id}/toggle`, {
				method: 'PATCH',
				credentials: 'include',
			});
			const data = await res.json();
			if (data.success) {
				setProducts((prev) =>
					prev.map((prod) => (prod._id === id ? data.product : prod)),
				);
				showNotification(
					`✅ Товар ${data.product.isActive ? 'активирован' : 'деактивирован'}`,
					'green',
				);
			} else {
				showNotification('❌ Не удалось изменить статус товара', 'red');
			}
		} catch (err) {
			console.error('Ошибка при изменении статуса активности:', err);
			showNotification('❌ Ошибка при переключении статуса товара', 'red');
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{loading && <Loader />}
			<Wrapper>
				<FormWrapper as="form" onSubmit={handleSubmit} style={{ minWidth: 280 }}>
					<h3>{editingId ? 'Редактировать товар' : 'Добавить товар'}</h3>

					<Label>
						Название товара:
						<Input
							type="text"
							name="title"
							value={form.title}
							onChange={handleChange}
							required
						/>
					</Label>

					<Label>
						Категория товара:
						<select
							name="category"
							value={form.category}
							onChange={handleChange}
							required
						>
							<option value="">Выберите категорию</option>
							{CATEGORIES.map((cat) => (
								<option key={cat.value} value={cat.value}>
									{cat.label}
								</option>
							))}
						</select>
					</Label>

					<Label>
						Цена товара:
						<Input
							type="number"
							name="price"
							value={form.price}
							onChange={handleChange}
							required
						/>
					</Label>

					<Label>
						Описание товара:
						<textarea
							name="description"
							value={form.description}
							onChange={handleChange}
							required
							style={{
								padding: 10,
								borderRadius: 6,
								border: '1px solid #ccc',
							}}
						/>
					</Label>

					<Label>
						Фото товара:
						<Input type="file" name="image" onChange={handleChange} />
					</Label>

					<Button type="submit" $variant="success">
						{editingId ? 'Сохранить' : 'Добавить'}
					</Button>

					{editingId && (
						<Button
							type="button"
							$variant="danger"
							onClick={() => {
								setEditingId(null);
								setForm({
									title: '',
									category: '',
									price: '',
									description: '',
									image: null,
								});
							}}
						>
							Отмена
						</Button>
					)}
				</FormWrapper>

				<div style={{ flex: 1 }}>
					<h3>Ваши товары</h3>
					<Table>
						<thead>
							<tr>
								<th>#</th>
								<th>Название</th>
								<th>Категория</th>
								<th>Цена</th>
								<th>Статус</th>
								<th>Фото</th>
								<th>Действия</th>
							</tr>
						</thead>
						<tbody>
							{products.map((p, i) => (
								<tr key={p._id}>
									<td>{i + 1}</td>
									<td>{p.title}</td>
									<td>
										{CATEGORIES.find((c) => c.value === p.category)
											?.label || p.category}
									</td>
									<td>{p.price}</td>
									<StatusTd>
										{p.isActive ? '✅ В продаже' : '⛔ Не в продаже'}
									</StatusTd>
									<PhotoTd title={p.image || ''}>
										{p.image ? `${p.image.slice(0, 10)}...` : '—'}
									</PhotoTd>
									<td>
										<Button onClick={() => handleEdit(p)}>✏️</Button>
										<Button
											$variant="danger"
											onClick={() => handleDelete(p._id)}
										>
											🗑️
										</Button>
										<Button
											onClick={() => toggleProductActive(p._id)}
										>
											{p.isActive
												? 'Деактивировать'
												: 'Активировать'}
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</div>
			</Wrapper>
		</>
	);
}
