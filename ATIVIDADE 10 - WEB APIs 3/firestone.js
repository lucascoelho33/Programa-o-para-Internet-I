var admin = require("firebase-admin");

var serviceAccount = require('./keys.json');

admin.initializeApp ({
    credential: admin.credential.cert(serviceAccount)
});

db = admin.firestore();

/*db.collection('posts').add({
    id: 1,
    text: "Olá JavaScript",
    likes: 5
})
console.log('conected');*/

db.collection("posts")
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log({id : doc.id, ...doc.data()});
        });
    })
    .catch((error) => {
        console.log('Erro ao obter documentos', error);
    });