import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../slices/authSlice';
import { request } from '../../utils/request';
import { FormWrapper, Label, Input, Button } from '../../components';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const Message = styled.p`
	color: ${(props) => (props.$error ? 'red' : 'green')};
	font-weight: 500;
`;

const ErrorText = styled.p`
	color: #ff4d4d;
	font-size: 14px;
	margin-top: 4px;
`;

const schema = yup.object({
	name: yup
		.string()
		.required('Введите имя')
		.min(2, 'Имя должно содержать минимум 2 символа'),
	email: yup.string().email('Некорректный email').required('Введите email'),
	password: yup.string().required('Введите пароль').min(8, 'Минимум 8 символов'),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref('password'), null], 'Пароли не совпадают')
		.required('Повторите пароль'),
});

export default function Register() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isValid },
		reset,
	} = useForm({
		resolver: yupResolver(schema),
		mode: 'onChange',
	});

	const onSubmit = async (data) => {
		try {
			const res = await request('http://localhost:5000/api/auth/register', 'POST', {
				name: data.name,
				email: data.email,
				password: data.password,
			});

			if (res.success) {
				dispatch(setUser({ user: res.user, token: res.token }));
				document.cookie = `token=${res.token}; path=/; max-age=${30 * 24 * 60 * 60}`;
				reset();
				navigate('/');
			} else {
				throw new Error(res.error || 'Ошибка регистрации');
			}
		} catch (err) {
			alert(err.message || 'Ошибка соединения с сервером');
		}
	};

	return (
		<FormWrapper>
			<h2>Регистрация</h2>

			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<Label>
					Имя:
					<Input type="text" {...register('name')} placeholder="Введите имя" />
					{errors.name && <ErrorText>{errors.name.message}</ErrorText>}
				</Label>

				<Label>
					Email:
					<Input
						type="email"
						{...register('email')}
						placeholder="example@mail.com"
					/>
					{errors.email && <ErrorText>{errors.email.message}</ErrorText>}
				</Label>

				<Label>
					Пароль:
					<Input
						type="password"
						{...register('password')}
						placeholder="Минимум 8 символов"
					/>
					{errors.password && <ErrorText>{errors.password.message}</ErrorText>}
				</Label>

				<Label>
					Повторите пароль:
					<Input
						type="password"
						{...register('confirmPassword')}
						placeholder="••••••••"
					/>
					{errors.confirmPassword && (
						<ErrorText>{errors.confirmPassword.message}</ErrorText>
					)}
				</Label>

				<Button type="submit" disabled={!isValid || isSubmitting}>
					{isSubmitting ? 'Отправка...' : 'Зарегистрироваться'}
				</Button>

				<p style={{ marginTop: 10 }}>
					Уже есть аккаунт?{' '}
					<span
						onClick={() => navigate('/login')}
						style={{
							color: '#b58900',
							cursor: 'pointer',
							textDecoration: 'underline',
						}}
					>
						Войти
					</span>
				</p>
			</form>
		</FormWrapper>
	);
}
