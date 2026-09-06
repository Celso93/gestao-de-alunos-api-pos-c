import { api } from './api.js'

export async function createStudent(alunoObject, loginResponse) {
    return await api()
        .post('/api/admin/alunos')
        .set('Content-Type', 'application/json')
        .set('Authorization', `${loginResponse}`)
        .send(alunoObject)
}