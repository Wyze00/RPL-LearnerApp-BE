import { app } from 'src/main.js';
import {beforeEach, describe, expect, it} from 'vitest';
import request from 'supertest';
import type { Application } from 'express';

describe('GET /api/templates/', () => {
    let appZ: Application;

    beforeEach(() => {
        appZ = app; 
    })

    it('Should can get template', async () => {
        
        const response = await request(appZ)
                            .get('/api/templates/q')

        const data = response.body as string;
        expect(data).toEqual({
            data: 'GET',
        });
    });
});