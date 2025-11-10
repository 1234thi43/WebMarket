import styled, { css } from 'styled-components';

export const Button = styled.button`
	padding: 10px 15px;
	border-radius: 6px;
	font-size: 15px;
	font-weight: 500;
	cursor: pointer;
	border: 1px solid #e0cfa5;
	background: #ffe0b3;
	transition: background 0.2s ease;

	&:hover {
		background: #ffd699;
	}

	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	${(props) =>
		props.$variant === 'danger' &&
		css`
			background: #ffcccc;
			border-color: #e0a5a5;
			&:hover {
				background: #ffb3b3;
			}
		`}

	${(props) =>
		props.$variant === 'success' &&
		css`
			background: #ccffcc;
			border-color: #a5e0a5;
			&:hover {
				background: #b3ffb3;
			}
		`}
`;
