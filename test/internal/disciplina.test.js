import app from '../../src/app.js';
import { expect } from 'chai';
import request from 'supertest';

import { comTokenDoAdmin } from '../helpers/auth.js';
import { createStudent } from '../helpers/alunos.js';
import { createDiscipline, enrollStudent } from '../helpers/disciplinas.js';
import { novoAluno } from '../factories/alunosFactory.js';
import { novaDisciplina } from '../factories/disciplinasFactory.js';


describe('Disciplinas', () => {

    let authorization, alunoResponse, aluno;

    beforeEach(async () => {
        authorization = await comTokenDoAdmin(app);

        aluno = novoAluno();

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
        const disciplinaResponse = await createDiscipline(novaDisciplina(), authorization, app);
        expect(disciplinaResponse.status).to.equal(201);

        const matriculaResponse = await enrollStudent(
            disciplinaResponse.body.id,
            alunoResponse.body.id,
            authorization,
            app
        );

        expect(matriculaResponse.status).to.equal(201);
        expect(matriculaResponse.body).to.have.property('alunoId', alunoResponse.body.id);
        expect(matriculaResponse.body).to.have.property('disciplinaId', disciplinaResponse.body.id);
        expect(matriculaResponse.body).to.have.property('dataMatricula').not.null;
    })
});
