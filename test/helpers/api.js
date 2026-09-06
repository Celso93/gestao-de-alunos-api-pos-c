import request from 'supertest';
import 'dotenv/config'

const BASE_URL = process.env.URL || 'http://localhost:3000';

// app:
// undefined  -> usa BASE_URL (testes externos: bate no server rodando)
// app        -> objeto Express (testes internos: sobe em processo, permite sinon)
export function api(app) {
  return request(app || BASE_URL);
}
