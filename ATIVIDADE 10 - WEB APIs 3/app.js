const {response} = require('express');
const express = require('express')
const app = express()
// response as Json
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// config do Firestore
var admin = require("firebase-admin");
const { request } = require('http');
var serviceAccount = require("./keys.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Endpoints

// Ver todas as postagens
app.get('/posts', async (request, response) => {
    postDoc = await db.collection("posts").orderBy('date', 'desc')

    const posts = []
    postDoc.forEach(doc => posts.push({id: doc.id, ...doc.data() }));
    response.status(200).json(posts);
})

// Pesquisar postagens
// url: http://localhost:3000/post?name=Lucas
app.get("/post", (req, res) => {
    var name = req.query.name;
    console.log(name)
    db.collection("posts").where("text", "==", name)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id, ...doc.data());
            result = doc.data();
            res.json({
                result
            })
        });
    })
    .catch((error) => {
        console.log("Erro ao obter documentos", error);
    });
})

// Ver uma postagem específica
app.get('Posts/:id', function (request, response) {
    id = request.params.id;
    id = id.substring(1);
    var docRef = db.collection("posts").doc(id);
    docRef.get().then((doc) => {
        if (doc.exists) {
            console.log(doc._fieldsProto.likes.integerValue) // caminho para pegar o número de likes de um post
            response.status(200).json(doc.data());
        } else {
            console.log("Sem documentos!");
        }
    }).catch((error) => {
        console.log("Erro ao obter documentos", error);
    });
})

// Alterar postagem
app.put('/posts/:id', async (request, response) => {
    id = request.params.id;
    id = id.substring(1);
    db.collection("posts").doc(id).set ({
        likes: request.body.likes,
        text: request.body.text,
        date: request.body.date
    })
        .then(() => {
            console.log("Documento escrito com sucesso");
        })
        .catch((error) => {
            console.log("Erro ao escrever documento: ", error);
        });
        return response.status(200).send('Post alterado.')
})

// Atualizar postagem
app.patch('/posts/:id', function (request, response) {
    id = request.params.id;
    id = id.substring(1);
    var postRef = db.collection("posts").doc(id);
    return postRef.update({
        text: request.body.text,
    })
        .then(() => {
            console.log("Documento atualizado com sucesso.");
            response.status(200).json('alterado');
        })
        .catch((error) => {
            console.error("Erro ao atualizar o documento: ", error);
        });
});
app.patch('/posts/:id/like', function (request, response) {
    id = request.params.id;
    id = id.substring(1);
    // pega o conteúdo de um post(curtidas)
    var docRef = db.collection("posts").doc(id);

    docRef.get().then((doc) => {
        if (doc.exists) {
            return docRef.update({
                likes: parseInt(doc._fieldsProto.likes.integerValue) + 1
            })
                .then(() => {
                    console.log("Documento atualizado com sucesso");
                    response.status(201).json('liked');
                })
                .catch((error) => {
                    console.error("Erro ao atualizar o documento: ", error);
                });
        } else {
            console.log("Sem documento");
        }
    }).catch((error) => {
        console.log("Erro ao atualizar o documento: ", error);
    });
});

// Criar uma postagem
app.post('/posts', async (request, response) => {
    const { text, likes, date} = request.body

    const post = { text, likes, date}

    const result = await db.collection('posts').add(post);

    response.status(201).json({id: result.id});
})

// Apagar a postagem
app.delete('/Posts/:id', (request, response) => {
    id = request.params.id;
    id = id.substring(1);
    db.collection("posts").doc(id).delete.then(() => {
        console.log("Documento apagado com sucesso");
    }).catch((error) => {
        console.error("Erro ao remover o documento: ", error);
    });
    response.status(204).send();
})

// Executar servidor
app.listen(3000, () => {
    console.log('Servidor em execução')
})