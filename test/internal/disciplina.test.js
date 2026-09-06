import app from '../../src/app.js';
import { expect } from 'chai';
import request from 'supertest';

import { comTokenDoAdmin } from '../helpers/auth.js';
import { createStudent } from '../helpers/alunos.js';
import { alunosFixture } from '../fixtures/alunos.js';


describe('Disciplinas', () => {

    let authorization, alunoResponse, aluno;

    beforeEach(async () => {
        authorization = await comTokenDoAdmin(app);

        aluno = alunosFixture.aleatorio();

        // gestão de dados (pré-condição): se o aluno já existe, apaga antes de recriar
        const listaResponse = await request(app)
            .get('/api/admin/alunos')
            .set('Authorization', authorization);

        const alunoExistente = listaResponse.body.find((a) => a.email === aluno.email);

        if (alunoExistente) {
            await request(app)
                .delete(`/api/admin/alunos/${alunoExistente.id}`)
                .set('Authorization', authorization);
        }

        alunoResponse = await createStudent(aluno, authorization, app);
    });

    afterEach(async () => {
        // gestão de dados (limpeza): garante que o aluno criado no teste seja apagado
        if (alunoResponse?.body?.id) {
            await request(app)
                .delete(`/api/admin/alunos/${alunoResponse.body.id}`)
                .set('Authorization', authorization);
        }
    });

    it('devo conseguir matricular um aluno novo a uma disciplina nova', async () => {
        const disciplinaResponse = await request(app)
            .post('/api/admin/disciplinas')
            .set('Content-Type', 'application/json')
            .set('Authorization', authorization)
            .expect(201)
            .send({
                nome: `Matemática${Date.now()}`,
                codigo: `MAT${Date.now()}`,
                cargaHoraria: 80
            })

        const matriculaResponse = await request(app)
            .post(`/api/admin/disciplinas/${disciplinaResponse.body.id}/matriculas`)
            .set('Content-Type', 'application/json')
            .set('Authorization', authorization)
            .send({
                alunoId: alunoResponse.body.id,
            })

        expect(matriculaResponse.status).to.equal(201);
        expect(matriculaResponse.body).to.have.property('alunoId', alunoResponse.body.id);
        expect(matriculaResponse.body).to.have.property('disciplinaId', disciplinaResponse.body.id);
        expect(matriculaResponse.body).to.have.property('dataMatricula').not.null;
    })
});
