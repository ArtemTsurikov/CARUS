import { Router } from 'express';

import { register, login, passwordResetLink, passwordReset } from '../controllers/authController.js';
import { validateLoginInput, validateRegisterInput, validatePasswordResetInput, validateUpdatePasswordInput } from '../middleware/validationMiddleware.js';

const router = Router();

router.post('/register', validateRegisterInput, register);
router.post('/login', validateLoginInput, login);
router.post('/passwordResetLink', validatePasswordResetInput, passwordResetLink);
router.post('/passwordReset/:token', validateUpdatePasswordInput, passwordReset);

export default router;