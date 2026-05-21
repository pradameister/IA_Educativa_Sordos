import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import User from './models/User';

const router = Router();
const getJwtSecret = () => process.env.JWT_SECRET || 'super-secret-key';

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario o email ya existe' });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, getJwtSecret(), { expiresIn: '1d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        progress: user.progress
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Error al registrar usuario', details: error.message });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user._id }, getJwtSecret(), { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        progress: user.progress
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Error al iniciar sesión', details: error.message });
  }
});

export default router;
