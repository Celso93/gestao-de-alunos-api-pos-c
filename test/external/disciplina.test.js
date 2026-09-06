import { expect } from 'chai';
import {api} from '../helpers/api.js';

import { comTokenDoAdmin } from '../helpers/auth.js';
import { createStudent } from '../helpers/alunos.js';
import { novoAluno } from '../factories/alunosFactory.js';
import { novaDisciplina } from '../factories/disciplinasFactory.js';


describe('Disciplinas', () => {

    let loginResponse, alunoResponse;

    beforeEach(async () => {
        loginResponse = await comTokenDoAdmin();
        alunoResponse = await createStudent(novoAluno(), loginResponse);
    });

    it('devo conseguir matricular um aluno novo a uma disciplina nova', async () => {
        const disciplinaResponse = await api()
            .post('/api/admin/disciplinas')
            .set('Content-Type', 'application/json')
            .set('Authorization', loginResponse)
            .expect(201)
            .send(novaDisciplina())

        const matriculaResponse = await api()
            .post(`/api/admin/disciplinas/${disciplinaResponse.body.id}/matriculas`)
            .set('Content-Type', 'application/json')
            .set('Authorization', loginResponse)
            .send({
                alunoId: alunoResponse.body.id,
            })

        expect(matriculaResponse.status).to.equal(201);
        expect(matriculaResponse.body).to.have.property('alunoId', alunoResponse.body.id);
        expect(matriculaResponse.body).to.have.property('disciplinaId', disciplinaResponse.body.id);
        expect(matriculaResponse.body).to.have.property('dataMatricula').not.null;
    })
});