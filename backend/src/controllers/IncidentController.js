const connection  = require('../database/connection');

module.exports = {
    async index(request, response) {
        const { page = 1 } = request.query; //Instruindo a apresentar a pagina pela url
        //^ Caso não encontre a pagina, mostra a pagina 1 ^

        // [count] = count[0];
        const [count] = await connection('incidents').count();

        const incidents = await connection('incidents')
        .join('ongs', 'ongs.id', '=', 'incidents.ong_id') //relaciona com outra tablela
        .limit(5) // limitando o numero de casos que aparecem na pagina em 5 por vez
        .offset((page - 1) * 5) // determina quais os 5 que irão aparecer 
        .select
        ([
            'incidents.*',
            'ongs.name',
            'ongs.email',
            'ongs.whatsapp',
            'ongs.city',
            'ongs.uf'
        ]); 
            /**
             * Como eu relacionei com outra tabela,
             *  para que os campos que possuem o mesmo nome não se sobreponham,
             *  eu especifico os campos que vou querer, para que não haja informações
             *  equivocadas
            */
        response.header('X-Total-Count', count['count(*)']);

        return response.json(incidents);
    },   

    async create(request, response) {
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;

        const [id] = await connection ('incidents').insert({
            title,
            description,
            value,
            ong_id,
        });

        return response.json({id});
    },

    async delete(request, response) {
        const { id } = request.params;
        const ong_id = request.headers.authorization; //verifica a ong que da o comando

        const incident = await connection('incidents')
        .where('id', id)
        .select('ong_id')
        .first();

        //verifica se a ong é responsavel pela criação do post caso contrario não permite a ação 
        if( incident.ong_id !== ong_id){ 
            return response.status(401).json({error: 'Operation not permitted.'});
        }

        await connection('incidents').where('id', id).delete();

        return response.status(204).send();
    }
};
