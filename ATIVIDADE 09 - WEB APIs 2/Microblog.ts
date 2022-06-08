const express = require('express')
const app = express()


class Post {
    id: number;
    text: string;
    likes: number;

    constructor(id: number, text: string, likes: number) {
        this.id = id;
        this.text = text;
        this.likes = likes;
    }
}

//------------------------------------------------------------------------
class Microblog {
    public posts = []

    create(post) {
        this.posts.push(post)
    }

    retrieve(id) {
        var numero = -1;
        for(var i = 0; i < this.posts.length; i++) {
            if(this.posts[i].id == id) {
                numero = i;
                break;
            }
        }
    }

    update(post) {
        post.id = parseInt(post.id)
        var achou = this.retrieve(post.id)
        if (achou != -1) {
            this.posts[achou].update(post.text)
        }else{
            console.log('Não achado')
        }
    }

    delete(id) {
        var numero = this.retrieve(id)
        if (numero != -1) {
            for(var i = numero; i < this.posts.length; i++) {
                this.posts[i] = this.posts[i + 1]
            }
        }
    }

    retrieveAll() {
        return this.posts
    }
}

//--------------------------------------------------------------------
var microblog = new Microblog();
microblog.create(new Post(0, 'hello javascript', 0))
microblog.create(new Post(1, 'hello python', 2))
microblog.create(new Post(2, 'hello HTML', 4))
microblog.create(new Post(3, 'hello PHP', 6))

app.get('/posts', (request, response) => {
    response.send(microblog.retrieveAll())
})

app.get('/posts/:id', (request, response) => {
    const id = request.params.id
    const post = microblog.retrieve(id)
    if (!Post) {
        response.status(404).send('Não achado')
    }
    response.json(post)
})

app.delete('/posts/:id', (request, response) => {
    const id = request.params.id
    microblog.delete(id)
    response.status(204).send()
})

app.post('/posts', (request, response) => {
    const text = request.body
    const  post = microblog.create(text)
    response.status(201).json(post)
})

app.put('/posts/:id', (request, response) => {
    const id = request.params.id
    microblog.update(request.body)
    response.status(200).send('Post alterado')
})

app.use(function(request, response, next) {
    response.status(404).send('Não achado')
});

app.listen('3000', () => {
    console.log('Servidor rodando')
})