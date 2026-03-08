import { test, expect } from '@playwright/test';
import { ApiClient } from '../src/utils/api-client';
import { UsersPage } from '../src/pages/users.page';
import { severity, tag } from 'allure-js-commons';

test.describe('Users API', () => {

    let apiClient: ApiClient;
    let usersPage: UsersPage;

    test.beforeEach(async ({ request }) => {
        apiClient = new ApiClient(request);
        usersPage = new UsersPage(apiClient);
    });

    test('GET /users - should return list of users', async () => {
        await severity('critical');
        await tag('smoke');

        const response = await usersPage.getAll();

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    test('GET /users/:id - should return single user', async () => {
        await severity('critical');
        await tag('smoke');

        const response = await usersPage.getById(1);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(1);
        expect(response.body.name).toBeDefined();
        expect(response.body.email).toBeDefined();
    });

    test('GET /users/:id - should return 404 for non-existent user', async () => {
        await severity('normal');
        await tag('regression');

        const response = await usersPage.getById(99999);

        expect(response.status).toBe(404);
    });

    test('POST /users - should create a new user', async () => {
        await severity('critical');
        await tag('smoke');

        const response = await usersPage.create({
            name: 'John Doe',
            username: 'johndoe',
            email: 'john@example.com',
        });

        expect(response.status).toBe(201);
        expect(response.body.name).toBe('John Doe');
        expect(response.body.email).toBe('john@example.com');
    });

    test('PUT /users/:id - should update a user', async () => {
        await severity('normal');
        await tag('regression');

        const response = await usersPage.update(1, {
            name: 'Jane Doe',
            username: 'janedoe',
            email: 'jane@example.com',
        });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Jane Doe');
    });

    test('DELETE /users/:id - should delete a user', async () => {
        await severity('normal');
        await tag('regression');

        const response = await usersPage.remove(1);

        expect(response.status).toBe(200);
    });

});