import { Routes, Route } from 'react-router-dom';
import { ModalProvider } from './components/common/modal/modal-context';
import { AuthAutoLoader } from './utils/auth-auto-loader';
import { Header, Footer, AppColumn, Page } from './components/layout';
import {
	Main,
	Register,
	Login,
	Users,
	ProductPage,
	ProductDetails,
	ProductCreate,
	NotFound,
	CartPage,
} from './pages';
import { NotificationProvider } from './components/common/notification/useNotification';

function App() {
	return (
		<NotificationProvider>
			<ModalProvider>
				<AppColumn>
					<Header />
					<AuthAutoLoader />

					<Page>
						<Routes>
							<Route path="/" element={<Main />} />
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />
							<Route path="/users" element={<Users />} />
							<Route path="/product" element={<ProductPage />} />
							<Route path="/product/add" element={<ProductCreate />} />
							<Route path="/product/:id" element={<ProductDetails />} />
							<Route path="/cart" element={<CartPage />} />
							<Route path="*" element={<NotFound />} />
						</Routes>
					</Page>

					<Footer>© 2025 WebMarket</Footer>
				</AppColumn>
			</ModalProvider>
		</NotificationProvider>
	);
}

export default App;
