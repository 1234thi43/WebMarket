import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { store } from './store.jsx';
import { Provider } from 'react-redux';

import { ModalProvider } from './components/common/modal/modal-context.jsx';
import { NotificationProvider } from './components/common/notification/notification-context.jsx';

createRoot(document.getElementById('root')).render(
	<Provider store={store}>
		<StrictMode>
			<BrowserRouter>
				<NotificationProvider>
					<ModalProvider>
						<App />
					</ModalProvider>
				</NotificationProvider>
			</BrowserRouter>
		</StrictMode>
	</Provider>,
);
