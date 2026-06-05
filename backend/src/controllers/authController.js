import { User } from '../models/User.js';
import { signToken } from '../utils/token.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const sanitize = (user) => ({ id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, area: user.area, ward: user.ward, language: user.language });

export const register = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({ token: signToken(user), user: sanitize(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Invalid email or password' });
  res.json({ token: signToken(user), user: sanitize(user) });
});

export const me = asyncHandler(async (req, res) => res.json({ user: sanitize(req.user) }));
