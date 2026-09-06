import { api } from './api.js'

export async function createStudent(alunoObject, authorization, app) {
    return await api(app)
        .post('/api/admin/alunos')
        .set('Content-Type', 'application/json')
        .set('Authorization', `${authorization}`)
        .send(alunoObject)
}
