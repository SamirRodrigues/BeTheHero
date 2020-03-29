const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection')

describe('ONG', () => {

    beforeEach( async () => {
       await connection.migrate.rollback(); // Reseta tudo que foi feito dentro do banco de dados
       await connection.migrate.latest(); // Inicia o banco de dados para poder validar as informações
    });

    afterAll (async () => {
        await connection.destroy();
    })

    it('should be able to create a new ONG', async () => {
        const response = await request(app)
        .post('/ongs')
        .send({
            name: "SamirUF",
            email: "samitec@ufrn.edu.br",
            whatsapp: "5584994200712",
            city: "Natal",
            uf: "RN"
        })

    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toHaveLength(8);
    });
});

/**  DICAS:
 * 
 * Para acessar o Header dentro dos tests usar o .set
 * Exemplo: 
 *      const response = await request(app)
        .post('/ongs')
        .set ('Authorization', 'ID VALIDO DE UMA ONG' )
        .send({
            name: "SamirUF",
            email: "samitec@ufrn.edu.br",
            whatsapp: "5584994200712",
            city: "Natal",
            uf: "RN"
        })
 * 
 */