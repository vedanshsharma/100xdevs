import {z} from Zod;

export const signupSchema = z.object({
    name : z.string().min(3),
    email : z.string().email("Invalid email address format."),
    password : z.string().min(8 , "Password must be at least 8 characters long.")
    .regex(/[0.9]/ , "Password must contain at least one number.")
    .regex(/[a-z]/ , "Password must contain at least one lowercase letter.")
    .regex(/[A-Z]/ , "Password must contain at least one uppercase letter.")
    .regex(/[^a-zA-Z0-9]/ , "Password must contain at least one special character.")
});

export const createTodoSchema = z.object({
    description : z.string().min(1 , "Description cannot be empty."),
    done : z.boolean().optional()
});

export const todoUpdateSchema = z.object({
    description : z.string().min(1 , "Description cannot be empty.").optional(),
    done : z.boolean().optional()
}).refine(
    (data) => data.description !== undefined || data.done !== undefined ,
    "At least one field (description or done) must be provided for update."
);




