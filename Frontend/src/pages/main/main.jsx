
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { addToCart } from '../../slices/cartSlice';
import { CATEGORIES } from '../../constants/categories';
import Loader from '../../components/common/loader/loader';
import { Button } from '../../components';
import { Label } from '../../components';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	padding: 30px;
	gap: 20px;
`;

const SearchBar = styled.input`
	padding: 10px 15px;
	font-size: 16px;
	border: 1px solid #e0cfa5;
	border-radius: 6px;
	width: 100%;
	max-width: 1200px;
`;

const SortBar = styled.select`
	padding: 10px;
	background-color: #faf7f0;
	border: 1px solid #e0cfa5;
	border-radius: 6px;
	font-size: 15px;
	cursor: pointer;
`;

const Content = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 20px;
	flex-wrap: wrap;
`;

const Categories = styled.aside`
	flex: 0 0 200px;
	border: 1px solid #e0cfa5;
	border-radius: 6px;
	padding: 20px;
	background-color: #fff;
	display: flex;
	flex-direction: column;
	gap: 10px;
`;

const CategoryLabel = styled(Label)`
	flex-direction: row;
	align-items: center;
	gap: 10px;
	font-weight: 400;
`;

const Products = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 15px;
`;

const ProductCard = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 15px;
	border: 1px solid #e0cfa5;
	border-radius: 6px;
	background-color: #fff8f0;
	transition: 0.2s;
	&:hover {
		box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
	}
`;

const ProductInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 20px;
`;

const ProductImage = styled.div`
	width: 80px;
	height: 80px;
	background-color: #f2e7d8;
	border-radius: 6px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #777;
	font-size: 14px;
	overflow: hidden;
`;

const ProductText = styled.div`
	display: flex;
	flex-direction: column;
	gap: 5px;
	color: #444;
`;

const Pagination = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 8px;
	margin-top: 25px;
	flex-wrap: wrap;
`;

const PageButton = styled(Button)`
	min-width: 40px;
	padding: 6px 10px;
	background-color: ${(props) => (props.active ? '#ffd699' : '#fff8f0')};
	border: 1px solid #e0cfa5;
	color: ${(props) => (props.active ? 'black' : '#444')};
	font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
`;

export default function Main() {
	const [products, setProducts] = useState([]);
	const [search, setSearch] = useState('');
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [sortOrder, setSortOrder] = useState('none');
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				const res = await fetch('http://localhost:5000/api/products');
				const data = await res.json();
				if (data.success) setProducts(data.products);
			} catch (err) {
				console.error('Ошибка при загрузке товаров:', err);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const toggleCategory = (cat) => {
		setSelectedCategories((prev) =>
			prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
		);
		setCurrentPage(1);
	};

	const filtered = useMemo(() => {
		let list = products;

		if (search.trim()) {
			list = list.filter((p) =>
				p.title.toLowerCase().includes(search.toLowerCase()),
			);
		}

		if (selectedCategories.length > 0) {
			list = list.filter((p) => selectedCategories.includes(p.category));
		}

		if (sortOrder === 'asc') {
			list = [...list].sort((a, b) => a.price - b.price);
		} else if (sortOrder === 'desc') {
			list = [...list].sort((a, b) => b.price - a.price);
		}

		return list;
	}, [products, search, selectedCategories, sortOrder]);

	const totalPages = Math.ceil(filtered.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

	const goToPage = (page) => {
		if (page >= 1 && page <= totalPages) setCurrentPage(page);
	};

	const renderPageNumbers = () => {
		const pages = [];
		const maxVisible = 5;
		let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
		let end = Math.min(totalPages, start + maxVisible - 1);

		if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

		for (let i = start; i <= end; i++) {
			pages.push(
				<PageButton
					key={i}
					active={i === currentPage}
					onClick={() => goToPage(i)}
				>
					{i}
				</PageButton>,
			);
		}

		return pages;
	};

	if (loading) return <Loader />;

	return (
		<Container>
			<SearchBar
				type="text"
				placeholder="Поиск по названию..."
				value={search}
				onChange={(e) => {
					setSearch(e.target.value);
					setCurrentPage(1);
				}}
			/>

			<Content>
				<Categories>
					<strong>Категории</strong>
					{CATEGORIES.map((cat) => (
						<CategoryLabel key={cat.value}>
							<input
								type="checkbox"
								checked={selectedCategories.includes(cat.value)}
								onChange={() => toggleCategory(cat.value)}
							/>
							{cat.label}
						</CategoryLabel>
					))}
				</Categories>

				<Products>
					<SortBar
						value={sortOrder}
						onChange={(e) => {
							setSortOrder(e.target.value);
							setCurrentPage(1);
						}}
					>
						<option value="none">Без сортировки</option>
						<option value="asc">Сначала дешёвые</option>
						<option value="desc">Сначала дорогие</option>
					</SortBar>

					{currentItems.map((p) => (
						<ProductCard
							key={p._id}
							onClick={() => navigate(`/product/${p._id}`)}
							style={{ cursor: 'pointer' }}
						>
							<ProductInfo>
								<ProductImage>
									{p.image ? (
										<img
											src={`http://localhost:5000${p.image}`}
											alt={p.title}
											style={{
												width: '100%',
												height: '100%',
												objectFit: 'cover',
												borderRadius: '6px',
											}}
										/>
									) : (
										'Нет фото'
									)}
								</ProductImage>
								<ProductText>
									<div>
										<strong>{p.title}</strong>
									</div>
									<div>
										Категория:{' '}
										{CATEGORIES.find((c) => c.value === p.category)
											?.label || p.category}
									</div>
									<div>Цена: {p.price} ₽</div>
									<div>
										Статус:{' '}
										{p.isActive ? (
											<span style={{ color: 'green' }}>
												в продаже ✅
											</span>
										) : (
											<span style={{ color: 'gray' }}>
												нет в продаже ⛔
											</span>
										)}
									</div>
								</ProductText>
							</ProductInfo>

							<Button
								disabled={!p.isActive}
								onClick={(e) => {
									e.stopPropagation();
									if (p.isActive) {
										dispatch(addToCart({ product: p, quantity: 1 }));
									}
								}}
							>
								{p.isActive ? 'Добавить в корзину' : 'Товар закончился'}
							</Button>
						</ProductCard>
					))}

					{filtered.length === 0 && (
						<p style={{ textAlign: 'center', color: '#777', marginTop: 20 }}>
							Ничего не найдено 😕
						</p>
					)}

					{filtered.length > 0 && (
						<Pagination>
							<Button
								onClick={() => goToPage(1)}
								disabled={currentPage === 1}
							>
								«
							</Button>
							<Button
								onClick={() => goToPage(currentPage - 1)}
								disabled={currentPage === 1}
							>
								‹
							</Button>

							{renderPageNumbers()}

							<Button
								onClick={() => goToPage(currentPage + 1)}
								disabled={currentPage === totalPages}
							>
								›
							</Button>
							<Button
								onClick={() => goToPage(totalPages)}
								disabled={currentPage === totalPages}
							>
								»
							</Button>
						</Pagination>
					)}
				</Products>
			</Content>
		</Container>
	);
}
