import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification from './notification';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
	const [notification, setNotification] = useState(null);

	const showNotification = useCallback((message, color = 'green') => {
		setNotification({ message, color });
		setTimeout(() => setNotification(null), 4000);
	}, []);

	return (
		<NotificationContext.Provider value={{ showNotification }}>
			{children}
			{notification && (
				<Notification message={notification.message} color={notification.color} />
			)}
		</NotificationContext.Provider>
	);
};
