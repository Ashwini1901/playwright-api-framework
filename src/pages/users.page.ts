import { ApiClient } from '../utils/api-client';
import { User, CreateUserDto, UpdateUserDto, CreateUserResponse } from '../models/user.model';

interface UsersListResponse extends Array<User> { }

export class UsersPage {
    private client: ApiClient;

    constructor(client: ApiClient) {
        this.client = client;
    }

    async getAll() {
        return this.client.get<UsersListResponse>('/users');
    }

    async getById(id: number) {
        return this.client.get<User>(`/users/${id}`);
    }

    async create(data: CreateUserDto) {
        return this.client.post<CreateUserResponse>('/users', data);
    }

    async update(id: number, data: UpdateUserDto) {
        return this.client.put<CreateUserResponse>(`/users/${id}`, data);
    }

    async remove(id: number) {
        return this.client.delete(`/users/${id}`);
    }
}