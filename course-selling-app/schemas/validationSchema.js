import {z} from 'zod';

export const signupSchema = z.object({
    name : z.string().min(3),
    email : z.string().email("Invalid email address format."),
    password : z.string().min(8 , "Password must be at least 8 characters long.")
    .regex(/[0.9]/ , "Password must contain at least one number.")
    .regex(/[a-z]/ , "Password must contain at least one lowercase letter.")
    .regex(/[A-Z]/ , "Password must contain at least one uppercase letter.")
    .regex(/[^a-zA-Z0-9]/ , "Password must contain at least one special character.")
});

export const courseCreateSchema = z.object({
    title : z.string().min(3 , "Course title must be at least 3 characters." ),
    description: z.string().min(10, { message: "Course description must be detailed." }),
    price: z.number()
             .min(0, { message: "Price cannot be negative." })
             .finite({ message: "Price must be a valid number." })
});

export const createTodoSchema = z.object({
    description : z.string().min(1 , "Description cannot be empty."),
    done : z.boolean().optional()
});

export const courseUpdateSchema = courseCreateSchema
    .partial()
    .strict()
    .refine( data => Object.keys(data).length > 0 , 
    "At least one field (title, description, price) must be provided for update.")





