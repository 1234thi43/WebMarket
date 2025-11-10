import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const MenuWrapper = styled.div`
	position: relative;
	display: inline-block;
`;

const MenuButton = styled.button`
	background: none;
	border: none;
	font-size: 18px;
	cursor: pointer;
	padding: 5px;
`;

const MenuList = styled.div`
	position: absolute;
	right: 0;
	top: 100%;
	background: #fff;
	border: 1px solid #ccc;
	border-radius: 6px;
	z-index: 10;
	min-width: 100px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MenuItem = styled.button`
	background: none;
	border: none;
	width: 100%;
	text-align: left;
	padding: 8px 12px;
	cursor: pointer;
	font-size: 14px;

	&:hover {
		background: #f5f5f5;
	}
`;

export const DropdownMenu = ({ items = [] }) => {
	const [isOpen, setIsOpen] = useState(false);
	const ref = useRef();

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<MenuWrapper ref={ref}>
			<MenuButton onClick={() => setIsOpen((o) => !o)}>⋮</MenuButton>
			{isOpen && (
				<MenuList>
					{items.map((item, i) => (
						<MenuItem key={i} onClick={item.onClick}>
							{item.label}
						</MenuItem>
					))}
				</MenuList>
			)}
		</MenuWrapper>
	);
};
