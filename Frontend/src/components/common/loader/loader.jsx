import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	padding: ${(props) => props.padding || '60px'};
`;

const Spinner = styled.div`
	border: 4px solid #f3f3f3;
	border-top: 4px solid #e0cfa5;
	border-radius: 50%;
	width: ${(props) => props.size || '40px'};
	height: ${(props) => props.size || '40px'};
	animation: ${spin} 1s linear infinite;
`;

export default function Loader({ size, padding }) {
	return (
		<LoaderWrapper padding={padding}>
			<Spinner size={size} />
		</LoaderWrapper>
	);
}
