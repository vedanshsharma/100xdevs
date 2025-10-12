import jwt from 'jsonwebtoken';
import zod from 'zod';

const emailSchema = zod.string.email();
const passwordSchema = zod.string.min(6);



