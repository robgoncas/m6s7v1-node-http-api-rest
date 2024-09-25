const http = require('http');
const { URLSearchParams } = require('url');

let paises = ['Chile', 'Argentina', 'Perú'];
let animales = [];

const server = http.createServer((req, res) => {
    //Log el método HTTP
    console.log(`Método HTTP: ${req.method}`);

    if (req.method === 'GET' && req.url === '/paises') {
        //Endpoint GET /paises - devuelve la lista de países
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(paises));

    } else if (req.method === 'POST' && req.url === '/paises') {
        //Endpoint POST /paises - agrega un país a la lista
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            if (!body) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'No se envió ningún dato en el cuerpo' }));
                return;
            }
            const nuevoPais = JSON.parse(body).pais;
            paises.push(nuevoPais);
            let paisesAsc = paises.sort();
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'País agregado', paisesAsc }));
        });
       
    } 
    else if (req.method === 'GET' && req.url.startsWith('/animal')) {
        //Endpoint GET /animal?nombre=tigre&familia=felinos - crea un animal
        //extrae los parámetros de consulta
        const queryParams = req.url.split('?')[1]; 
        const searchParams = new URLSearchParams(queryParams);

        const animal = {
            nombre: searchParams.get('nombre'),
            familia: searchParams.get('familia')
        };

        if (animal.nombre && animal.familia) {
            animales.push(animal);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Animal agregado', animales }));
        } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Faltan parámetros' }));
        }

    } else {
        //Endpoint no encontrado
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Endpoint no encontrado' }));
    }
});

//Puerto de escucha del servidor
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
