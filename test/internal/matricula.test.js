import app from '../../src/app.js';
import { expect } from 'chai';
import request from 'supertest';

import { loginUser } from '../helpers/auth.js';
import { createStudent } from '../helpers/alunos.js';
import { alunosFixture } from '../fixtures/alunos.js';


describe('Disciplinas', () => {

    let loginResponse;
    let alunoResponse;
    beforeEach(async () => {
        loginResponse = await loginUser(app, 'admin@escola.com', 'admin123');
        alunoResponse = await createStudent(app, alunosFixture.aleatorio(), loginResponse);
    });

    it('devo conseguir matricular um aluno novo a uma disciplina nova', async () => {
        const disciplinaResponse = await request(app)
            .post('/api/admin/disciplinas')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${loginResponse.body.token}`)
            .expect(201)
            .send({
                nome: `Matemática${Date.now()}`,
                codigo: `MAT${Date.now()}`,
                cargaHoraria: 80
            })

        const matriculaResponse = await request(app)
            .post(`/api/admin/disciplinas/${disciplinaResponse.body.id}/matriculas`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${loginResponse.body.token}`)
            .send({
                alunoId: alunoResponse.body.id,
            })

        expect(matriculaResponse.status).to.equal(201);
        expect(matriculaResponse.body).to.have.property('alunoId', alunoResponse.body.id);
        expect(matriculaResponse.body).to.have.property('disciplinaId', disciplinaResponse.body.id);
        expect(matriculaResponse.body).to.have.property('dataMatricula').not.null;
    })
});