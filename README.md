### ¿Qué es una API REST?

Una **API REST** (Interfaz de Programación de Aplicaciones con Transferencia de Estado Representacional) es un conjunto de reglas y convenciones que permiten la comunicación entre aplicaciones a través de **HTTP**. El objetivo principal de una API REST es proporcionar una manera de interactuar con recursos (como datos de una base de datos) utilizando operaciones estándar de HTTP como **GET**, **POST**, **PUT**, **DELETE**, entre otros.

REST es una arquitectura que define cómo estructurar las comunicaciones entre el cliente (generalmente una aplicación web o móvil) y el servidor (que contiene los datos y la lógica de negocio).

### Características Clave de una API REST

1. **Sin estado (Stateless)**: Cada petición del cliente al servidor debe contener toda la información necesaria para que el servidor pueda entenderla y procesarla. Esto significa que el servidor no almacena el estado de las peticiones anteriores.
   
2. **Uso de métodos HTTP estándar**: Se utilizan los métodos HTTP para realizar operaciones específicas:
   - **GET**: Obtener datos o recursos.
   - **POST**: Crear nuevos recursos.
   - **PUT**: Actualizar recursos existentes.
   - **DELETE**: Eliminar recursos.

3. **Recursos identificados por URLs**: Cada recurso en un sistema REST tiene una **URL** única que lo identifica. Por ejemplo:
   - `https://api.ejemplo.com/usuarios`: Podría representar una lista de usuarios.
   - `https://api.ejemplo.com/usuarios/1`: Podría representar un usuario específico con ID 1.

4. **Intercambio de datos en formatos estándar**: Los datos se intercambian utilizando formatos estándar como **JSON** o **XML**, aunque JSON es el más común en las APIs modernas.

### Métodos HTTP Comparados con CRUD

Los métodos HTTP en REST se corresponden con las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) de las bases de datos:

- **GET** → **Read (Leer)**: Recupera información de un recurso.
- **POST** → **Create (Crear)**: Crea un nuevo recurso.
- **PUT/PATCH** → **Update (Actualizar)**: Actualiza un recurso existente.
- **DELETE** → **Delete (Eliminar)**: Elimina un recurso.

### Ejemplo de Flujo en una API REST

Supongamos que tienes una API para gestionar productos de una tienda en línea. Esta API podría incluir los siguientes endpoints:

1. **GET `/productos`**: Obtener una lista de productos.
2. **GET `/productos/{id}`**: Obtener un producto específico por su ID.
3. **POST `/productos`**: Agregar un nuevo producto.
4. **PUT `/productos/{id}`**: Actualizar un producto existente. (INCLUIR OBJETO COMPLETO)
5. **PATCH `/productos/{id}`**: Actualizar un producto existente. (INCLUIR 1 O MAS ATRIBUTOS DEL OBJETO)
6. **DELETE `/productos/{id}`**: Eliminar un producto.

### Ejemplo de Petición y Respuesta en una API REST

#### Petición GET (Obtener la lista de productos)
```
GET /productos HTTP/1.1
Host: api.tienda.com
```

#### Respuesta del servidor
```json
[
    {
        "id": 1,
        "nombre": "Laptop",
        "precio": 1500,
        "stock": 20
    },
    {
        "id": 2,
        "nombre": "Mouse",
        "precio": 20,
        "stock": 100
    }
]
```
#### Petición POST (Agregar un nuevo producto)
```
POST /productos HTTP/1.1
Host: api.tienda.com
Content-Type: application/json

{
    "nombre": "Teclado",
    "precio": 45,
    "stock": 50
}
```
#### Respuesta del servidor
```json
{
    "mensaje": "Producto agregado exitosamente",
    "producto": {
        "id": 3,
        "nombre": "Teclado",
        "precio": 45,
        "stock": 50
    }
}
```
### Ventajas de una API REST

- **Simplicidad**: Utiliza estándares HTTP comunes, lo que facilita la implementación y el consumo de la API.
- **Escalabilidad**: Al ser sin estado, es más fácil escalar el servidor para manejar muchas solicitudes simultáneas.
- **Flexibilidad**: Puede ser consumida por cualquier cliente que pueda hacer solicitudes HTTP (navegadores, aplicaciones móviles, otras aplicaciones web, etc.).

### Ejemplo de API REST con Ventas (GET y POST)

En este caso, vamos a crear un servidor en Node.js que gestione **ventas**. El servidor tendrá dos rutas:

1. **GET `/ventas`**: Devuelve una lista de todas las ventas realizadas.
2. **POST `/ventas`**: Permite agregar una nueva venta enviando los datos de la venta en formato JSON.

### Ejemplo de Código: Servidor Node.js con Ventas

```javascript
const http = require('http');
const { URL } = require('url');

let ventas = [
    { id: 1, producto: 'Laptop', cantidad: 2, total: 1500 },
    { id: 2, producto: 'Mouse', cantidad: 5, total: 50 }
];

const server = http.createServer((req, res) => {
    // Obtener el método HTTP y la URL de la petición
    const metodo = req.method;
    const ruta = new URL(req.url, `http://${req.headers.host}`).pathname;

    // Procesar el método GET para obtener la lista de ventas
    if (metodo === 'GET' && ruta === '/ventas') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(ventas));

    // Procesar el método POST para agregar una nueva venta
    } else if (metodo === 'POST' && ruta === '/ventas') {
        let body = '';

        // Recibir los datos del cuerpo de la solicitud
        req.on('data', chunk => {
            body += chunk;
        });

        // Cuando se complete la recepción de datos, procesar el cuerpo
        req.on('end', () => {
            const nuevaVenta = JSON.parse(body);  // se espera un objeto JSON {"producto": "Teclado", "cantidad": 3, "total": 120}
            
            // Asignar un nuevo ID a la venta
            nuevaVenta.id = ventas.length + 1;
            ventas.push(nuevaVenta);
            
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Venta agregada', ventas }));
        });

    // Respuesta para una ruta no encontrada
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Recurso no encontrado' }));
    }
});

// El servidor escucha en el puerto 3000
server.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});
```

### Explicación del Código

1. **GET `/ventas`**:
   - Cuando el cliente hace una petición **GET** a `/ventas`, el servidor devuelve un arreglo de objetos que representan las ventas realizadas. Cada venta tiene un `id`, `producto`, `cantidad`, y `total`.

   **Respuesta de ejemplo**:
   ```json
   [
       { "id": 1, "producto": "Laptop", "cantidad": 2, "total": 1500 },
       { "id": 2, "producto": "Mouse", "cantidad": 5, "total": 50 }
   ]
   ```

2. **POST `/ventas`**:
   - Cuando el cliente envía una petición **POST** a `/ventas`, espera un cuerpo con la información de una venta en formato JSON. El servidor recibe la nueva venta, le asigna un `id` único y la agrega a la lista de ventas.

   **Cuerpo de ejemplo en la solicitud POST**:
   ```json
   {
       "producto": "Teclado",
       "cantidad": 3,
       "total": 120
   }
   ```

   **Respuesta de ejemplo**:
   ```json
   {
       "mensaje": "Venta agregada",
       "ventas": [
           { "id": 1, "producto": "Laptop", "cantidad": 2, "total": 1500 },
           { "id": 2, "producto": "Mouse", "cantidad": 5, "total": 50 },
           { "id": 3, "producto": "Teclado", "cantidad": 3, "total": 120 }
       ]
   }
   ```

3. **Procesamiento de la Petición**:
   - El servidor escucha las peticiones en la ruta `/ventas`.
   - Para la ruta **GET**, simplemente envía la lista de ventas almacenadas.
   - Para la ruta **POST**, recibe el cuerpo de la solicitud, lo convierte en JSON, le asigna un ID único a la nueva venta, y la agrega al arreglo `ventas`.

4. **Manejo de Eventos `data` y `end`**:
   - **`req.on('data')`**: Captura fragmentos (chunks) de datos enviados en una solicitud POST.
   - **`req.on('end')`**: Cuando se completa la recepción de los datos, se procesa el cuerpo y se agrega la nueva venta.

5. **Códigos de Estado**:
   - **200**: Para el éxito en la solicitud **GET**.
   - **201**: Para la creación exitosa de una nueva venta en la solicitud **POST**.
   - **404**: Si el recurso solicitado no existe.