import { api } from './api.js';
import 'dotenv/config'

let tokenEmCache = null;

export async function comTokenDoAdmin(app) {
  if (!tokenEmCache) {
    const loginResponse = await loginUser(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD, app);
    tokenEmCache = loginResponse.body.token;
  }
  return `Bearer ${tokenEmCache}`
}

export async function loginUser(email, senha, app) {
  return await api(app)
    .post('/api/auth/login')
    .set('Content-Type', 'application/json')
    .send({ email, senha });
}
