const bcrypt = require('bcrypt');
const User = require('../models/User');
const ROLES = require('../constants/roles');
const { generate } = require('../helpers/token');
const mapUser = require('../helpers/mapUser');

// === Регистрация ===
async function register(name, email, password) {
	if (!email || !password) {
		throw new Error('Email и пароль обязательны');
	}

	const existing = await User.findOne({ email });
	if (existing) {
		throw new Error('Пользователь с таким email уже существует');
	}

	const passwordHash = await bcrypt.hash(password, 10);

	const user = await User.create({
		name,
		email,
		password: passwordHash,
		role: ROLES.USER,
		createdAt: new Date(),
	});

	// === Генерация токена ===
	const token = generate({ id: user.id });

	return { user, token };
}

// === Авторизация ===
async function login(email, password) {
	if (!email || !password) {
		throw new Error('Email и пароль обязательны');
	}

	const user = await User.findOne({ email });
	if (!user) {
		throw new Error('Пользователь не найден');
	}

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		throw new Error('Неверный пароль');
	}

	const token = generate({ id: user.id });
	return { user, token };
}

module.exports = { register, login };
