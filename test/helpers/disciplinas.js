import { api } from './api.js'

export async function createDiscipline(disciplinaObject, authorization, app) {
    return await api(app)
        .post('/api/admin/disciplinas')
        .set('Content-Type', 'application/json')
        .set('Authorization', `${authorization}`)
        .send(disciplinaObject)
}

export async function enrollStudent(disciplinaId, alunoId, authorization, app) {
    return await api(app)
        .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `${authorization}`)
        .send({ alunoId })
}
