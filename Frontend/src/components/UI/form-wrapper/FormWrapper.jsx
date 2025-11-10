import styled from 'styled-components';

export const FormWrapper = styled.div`
	max-width: 600px;
	margin: 0 auto;
	background: #fffdf7;
	padding: 30px;
	border-radius: 10px;
	border: 1px solid #e0cfa5;
	display: flex;
	flex-direction: column;
	gap: 20px;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

	@media (max-width: 600px) {
		padding: 20px;
	}
`;
