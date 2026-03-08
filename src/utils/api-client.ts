import { APIRequestContext } from '@playwright/test';

export class ApiClient {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async get<T = Record<string, unknown>>(endpoint: string): Promise<{ status: number; body: T }> {
        const response = await this.request.get(endpoint);
        const body = await response.json() as T;

        console.log(`GET ${endpoint} → ${response.status()}`);

        return {
            status: response.status(),
            body,
        };
    }

    async post<T = Record<string, unknown>>(endpoint: string, data: unknown): Promise<{ status: number; body: T }> {
        const response = await this.request.post(endpoint, { data });
        const body = await response.json() as T;

        console.log(`POST ${endpoint} → ${response.status()}`);

        return {
            status: response.status(),
            body,
        };
    }

    async put<T = Record<string, unknown>>(endpoint: string, data: unknown): Promise<{ status: number; body: T }> {
        const response = await this.request.put(endpoint, { data });
        const body = await response.json() as T;

        console.log(`PUT ${endpoint} → ${response.status()}`);

        return {
            status: response.status(),
            body,
        };
    }

    async delete(endpoint: string): Promise<{ status: number }> {
        const response = await this.request.delete(endpoint);

        console.log(`DELETE ${endpoint} → ${response.status()}`);

        return {
            status: response.status(),
        };
    }
}