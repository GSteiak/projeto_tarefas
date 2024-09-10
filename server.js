const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve arquivos estáticos da pasta 'public'

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/gerenciador-tarefas')
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar ao MongoDB', err));

// Definir o esquema e o modelo de tarefa
const tarefaSchema = new mongoose.Schema({
    texto: String,
});

const Tarefa = mongoose.model('Tarefa', tarefaSchema);

// Rotas
app.get('/tarefas', async (req, res) => {
    const tarefas = await Tarefa.find();
    res.json(tarefas);
});

app.post('/tarefas', async (req, res) => {
    const novaTarefa = new Tarefa({ texto: req.body.texto });
    await novaTarefa.save();
    res.status(201).json(novaTarefa);
});

app.delete('/tarefas/:id', async (req, res) => {
    await Tarefa.findByIdAndDelete(req.params.id);
    res.status(204).end();
});

app.put('/tarefas/:id', async (req, res) => {
    const tarefaAtualizada = await Tarefa.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(tarefaAtualizada);
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
