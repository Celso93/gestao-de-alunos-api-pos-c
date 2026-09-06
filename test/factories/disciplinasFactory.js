import { faker } from '@faker-js/faker';

export function novaDisciplina() {
    const timestamp = Date.now();

    return {
        nome: `${faker.word.noun()} ${timestamp}`,
        codigo: `${faker.string.alpha({ length: 3, casing: 'upper' })}${timestamp}`,
        cargaHoraria: faker.helpers.arrayElement([40, 60, 80, 120]),
    };
}
