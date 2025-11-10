import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { Modal as ModalComponent } from '../modal/modal';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [text, setText] = useState('');
	const [onConfirm, setOnConfirm] = useState(() => () => {});
	const [onCancel, setOnCancel] = useState(() => () => {});
	const timeoutRef = useRef(null);

	const openModal = useCallback(({ text, onConfirm, onCancel }) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}

		setText(text);
		setOnConfirm(() => onConfirm || (() => {}));
		setOnCancel(() => onCancel || (() => {}));
		setIsOpen(true);
	}, []);

	const closeModal = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		setIsOpen(false);
	}, []);

	return (
		<ModalContext.Provider value={{ openModal, closeModal }}>
			{children}
			{isOpen && (
				<ModalComponent
					isOpen={isOpen}
					text={text}
					onConfirm={() => {
						onConfirm?.();
						setIsOpen(false);
					}}
					onCancel={() => {
						onCancel?.();
						setIsOpen(false);
					}}
				/>
			)}
		</ModalContext.Provider>
	);
};
