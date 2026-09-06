import { api } from './api.js';
import 'dotenv/config'

let tokenEmCache = null;

export async function comTokenDoAdmin() {
  if (!tokenEmCache) {
    const loginResponse = await loginUser(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
    tokenEmCache = loginResponse.body.token;
  }
  return `Bearer ${tokenEmCache}`
}

export async function loginUser(email, senha) {
  return await api()
    .post('/api/auth/login')
    .set('Content-Type', 'application/json')
    .send({ email, senha });
}
