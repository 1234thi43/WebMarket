import { useState } from 'react';
import Loader from '../../components/common/loader/loader';
import { CATEGORIES } from '../../constants/categories';
import { FormWrapper, Label, Input, TextArea, Select, Button } from '../../components';
import { useNotification } from '../../components/common/notification/useNotification';
import { URL } from '../../constants/url';

export default function ProductCreate() {
	const [form, setForm] = useState({
		title: '',
		description: '',
		price: '',
		category: '',
		image: null,
	});
	const [loading, setLoading] = useState(false);
	const { showNotification } = useNotification();

	const handleChange = (e) => {
		const { name, value, files } = e.target;
		setForm({
			...form,
			[name]: files ? files[0] : value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const formData = new FormData();
			formData.append('title', form.title);
			formData.append('description', form.description);
			formData.append('price', form.price);
			formData.append('category', form.category);
			if (form.image) formData.append('image', form.image);

			// const response = await fetch('http://localhost:5000/api/products', {
			const response = await fetch(`${URL}/api/products`, {
				method: 'POST',
				body: formData,
				credentials: 'include',
			});

			const data = await response.json();

			if (!response.ok || !data.success) {
				throw new Error(data.message || 'Ошибка при добавлении товара');
			}

			showNotification('✅ Товар успешно добавлен!', 'green');
			setForm({
				title: '',
				description: '',
				price: '',
				category: '',
				image: null,
			});
		} catch (error) {
			console.error('Ошибка:', error);
			showNotification(
				'❌ Не удалось добавить товар. Подробности в консоли.',
				'red',
			);
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <Loader />;

	return (
		<FormWrapper>
			<h2>Добавить новый товар</h2>
			<form onSubmit={handleSubmit}>
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
					Описание:
					<TextArea
						name="description"
						value={form.description}
						onChange={handleChange}
						required
					/>
				</Label>

				<Label>
					Цена:
					<Input
						type="number"
						name="price"
						value={form.price}
						onChange={handleChange}
						required
					/>
				</Label>

				<Label>
					Категория:
					<Select
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
					</Select>
				</Label>

				<Label>
					Изображение:
					<Input
						type="file"
						name="image"
						accept="image/*"
						onChange={handleChange}
					/>
				</Label>

				<Button type="submit">Добавить товар</Button>
			</form>
		</FormWrapper>
	);
}
