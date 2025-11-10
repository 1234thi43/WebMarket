import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../slices/authSlice';
import { request } from '../../utils/request';
import { FormWrapper, Label, Input, Button } from '../../components';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { URL } from '../../constants/url';

const Message = styled.p`
	color: ${(props) => (props.$error ? 'red' : 'green')};
	font-weight: 500;
`;

const ErrorText = styled.p`
	color: #ff4d4d;
	font-size: 14px;
	margin-top: 4px;
`;

export default function Login() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const schema = yup.object({
		email: yup.string().email('Некорректный email').required('Введите email'),
		password: yup.string().min(4, 'Минимум 4 символов').required('Введите пароль'),
	});

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
			const res = await request(
				// `http://localhost:5000/api/auth/login`,
				`${URL}/api/auth/login`,
				'POST',
				data,
			);

			if (res.success) {
				document.cookie = `token=${res.token}; path=/; max-age=${30 * 24 * 60 * 60}`;
				dispatch(setUser({ user: res.user, token: res.token }));
				reset();
				navigate('/');
			} else {
				throw new Error(res.error || 'Ошибка авторизации');
			}
		} catch (err) {
			alert(err.message || 'Ошибка соединения с сервером');
		}
	};

	return (
		<FormWrapper>
			<h2>Вход</h2>

			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<Label>
					Email:
					<Input
						type="email"
						{...register('email')}
						$error={!!errors.email}
						placeholder="example@mail.com"
					/>
					{errors.email && <ErrorText>{errors.email.message}</ErrorText>}
				</Label>

				<Label>
					Пароль:
					<Input
						type="password"
						{...register('password')}
						$error={!!errors.password}
						placeholder="••••••••"
					/>
					{errors.password && <ErrorText>{errors.password.message}</ErrorText>}
				</Label>

				<Button type="submit" disabled={!isValid || isSubmitting}>
					{isSubmitting ? 'Отправка...' : 'Войти'}
				</Button>

				<p style={{ marginTop: 10 }}>
					Нет аккаунта?
					<span
						onClick={() => navigate('/register')}
						style={{
							color: '#b58900',
							cursor: 'pointer',
							textDecoration: 'underline',
						}}
					>
						Зарегистрироваться
					</span>
				</p>
			</form>
		</FormWrapper>
	);
}
