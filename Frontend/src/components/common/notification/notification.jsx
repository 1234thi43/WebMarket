import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeInDown = keyframes`
	from {
		opacity: 0;
		transform: translateY(-20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
`;

const NotificationBox = styled.div`
	position: fixed;
	top: 20px;
	left: 50%;
	transform: translateX(-50%);
	background-color: ${({ color }) => color || 'green'};
	color: white;
	padding: 12px 24px;
	border-radius: 8px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
	font-weight: 500;
	z-index: 2000;
	animation: ${fadeInDown} 0.3s ease-out;
`;

export default function Notification({ message, color }) {
	return <NotificationBox color={color}>{message}</NotificationBox>;
}
