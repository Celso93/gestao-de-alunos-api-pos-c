import { expect } from 'chai';

import { comTokenDoAdmin } from '../helpers/auth.js';
import { createStudent } from '../helpers/alunos.js';
import { createDiscipline, enrollStudent } from '../helpers/disciplinas.js';
import { novoAluno } from '../factories/alunosFactory.js';
import { novaDisciplina } from '../factories/disciplinasFactory.js';


describe('Disciplinas', () => {

    let loginResponse, alunoResponse;

    beforeEach(async () => {
        loginResponse = await comTokenDoAdmin();
        alunoResponse = await createStudent(novoAluno(), loginResponse);
    });

    it('devo conseguir matricular um aluno novo a uma disciplina nova', async () => {
        const disciplinaResponse = await createDiscipline(novaDisciplina(), loginResponse);
        expect(disciplinaResponse.status).to.equal(201);

        const matriculaResponse = await enrollStudent(
            disciplinaResponse.body.id,
            alunoResponse.body.id,
            loginResponse
        );

        expect(matriculaResponse.status).to.equal(201);
        expect(matriculaResponse.body).to.have.property('alunoId', alunoResponse.body.id);
        expect(matriculaResponse.body).to.have.property('disciplinaId', disciplinaResponse.body.id);
        expect(matriculaResponse.body).to.have.property('dataMatricula').not.null;
    })
});