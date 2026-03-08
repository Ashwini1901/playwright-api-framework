export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    phone?: string;
    website?: string;
}

export interface CreateUserDto {
    name: string;
    username: string;
    email: string;
}

export interface UpdateUserDto {
    name: string;
    username: string;
    email: string;
}

export interface CreateUserResponse {
    id: number;
    name: string;
    username: string;
    email: string;
}

export const UserSchema = {
    type: 'object',
    required: ['id', 'name', 'username', 'email'],
    properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        website: { type: 'string' },
    },
};

export const UsersArraySchema = {
    type: 'array',
    items: UserSchema,
};

export const CreateUserResponseSchema = {
    type: 'object',
    required: ['id', 'name', 'username', 'email'],
    properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string' },
    },
};