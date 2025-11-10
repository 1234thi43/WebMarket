import styled from 'styled-components';

const ModalContainer = ({ className, isOpen, text, onConfirm, onCancel }) => {
	if (!isOpen) return null;

	return (
		<div className={className}>
			<div className="overlay" onClick={onCancel}></div>
			<div className="box">
				<h3>{text}</h3>
				<div className="buttons">
					<button width="120px" onClick={onConfirm}>
						Да
					</button>
					<button width="120px" onClick={onCancel}>
						Отмена
					</button>
				</div>
			</div>
		</div>
	);
};

export const Modal = styled(ModalContainer)`
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 20;

	& .overlay {
		position: absolute;
		background-color: rgba(0, 0, 0, 0.6);
		width: 100%;
		height: 100%;
	}

	& .box {
		margin: auto;
		position: relative;
		text-align: center;
		background-color: white;
		color: black;
		border: 1px solid black;
		width: 400px;
		padding: 0 20px 20px 20px;
		z-index: 30;
		top: 50%;
		transform: translate(0, -50%);
	}

	& .buttons {
		display: flex;
		justify-content: space-evenly;
	}
`;
