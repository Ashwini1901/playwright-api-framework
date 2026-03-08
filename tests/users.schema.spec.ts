import { test, expect } from '@playwright/test';
import { ApiClient } from '../src/utils/api-client';
import { UsersPage } from '../src/pages/users.page';
import { SchemaValidator } from '../src/utils/schema-validator';
import { UserSchema, UsersArraySchema, CreateUserResponseSchema } from '../src/models/user.model';
import { severity, tag } from 'allure-js-commons';

test.describe('Users API - Schema Validation', () => {

    let apiClient: ApiClient;
    let usersPage: UsersPage;

    test.beforeEach(async ({ request }) => {
        apiClient = new ApiClient(request);
        usersPage = new UsersPage(apiClient);
    });

    test('GET /users - matches users array schema', async () => {
        await severity('critical');
        await tag('schema');

        const response = await usersPage.getAll();

        expect(response.status).toBe(200);
        SchemaValidator.validate(response.body, UsersArraySchema);
    });

    test('GET /users/:id - matches single user schema', async () => {
        await severity('critical');
        await tag('schema');

        const response = await usersPage.getById(1);

        expect(response.status).toBe(200);
        SchemaValidator.validate(response.body, UserSchema);
    });

    test('POST /users - matches create user response schema', async () => {
        await severity('critical');
        await tag('schema');

        const response = await usersPage.create({
            name: 'Schema Test',
            username: 'schematest',
            email: 'schema@test.com',
        });

        expect(response.status).toBe(201);
        SchemaValidator.validate(response.body, CreateUserResponseSchema);
    });

    test('Schema catches wrong field type', async () => {
        await severity('normal');
        await tag('schema');

        const brokenResponse = {
            id: 'should-be-a-number',
            name: 'Test',
            username: 'test',
            email: 'test@test.com',
        };

        expect(() => {
            SchemaValidator.validate(brokenResponse, UserSchema);
        }).toThrow('Schema validation failed');
    });

});