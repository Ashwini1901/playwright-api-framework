import { test, expect } from '@playwright/test';
import { ApiClient } from '../src/utils/api-client';
import { UsersPage } from '../src/pages/users.page';
import { validUserIds, invalidUserIds, validUsers } from '../src/data/users.data';
import { severity, tag } from 'allure-js-commons';

test.describe('Users API - Data Driven', () => {

    let apiClient: ApiClient;
    let usersPage: UsersPage;

    test.beforeEach(async ({ request }) => {
        apiClient = new ApiClient(request);
        usersPage = new UsersPage(apiClient);
    });

    for (const userId of validUserIds) {
        test(`GET /users/${userId} - should return valid user`, async () => {
            await severity('normal');
            await tag('data-driven');

            const response = await usersPage.getById(userId);

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(userId);
        });
    }

    for (const userId of invalidUserIds) {
        test(`GET /users/${userId} - should return 404`, async () => {
            await severity('normal');
            await tag('data-driven');

            const response = await usersPage.getById(userId);

            expect(response.status).toBe(404);
        });
    }

    for (const user of validUsers) {
        test(`POST /users - should create: ${user.name}`, async () => {
            await severity('normal');
            await tag('data-driven');

            const response = await usersPage.create(user);

            expect(response.status).toBe(201);
            expect(response.body.name).toBe(user.name);
        });
    }

});