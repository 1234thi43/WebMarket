import styled, { css } from 'styled-components';

export const Input = styled.input`
	padding: 10px;
	border: 1px solid #ccc;
	border-radius: 6px;
	font-size: 15px;
	width: 100%;

	${(props) =>
		props.$error &&
		css`
			border-color: #ff6b6b;
			background: #fff0f0;
		`}
`;
