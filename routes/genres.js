const Joi = require('joi');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50 
    },
    date: {type: Date, default: Date.now}
});

const Genre = mongoose.model('Genre', genreSchema);

router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

router.post('/', async (req, res) => {
    const { error } = validateGenre(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({
        name: req.body.name
    });

    // genres.push(genre);
    await genre.save();
    res.send(genre);
});

router.put('/:id', async (req, res) => {
    //Validar la informacion ingresada
    const { error } = validateGenre(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
        new: true
    })

    //Encontrarlo
    if(!genre) return res.status(404).send('No se encontro el genero.');

    res.send(genre);
});

router.delete('/:id', async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if(!genre) return res.status(404).send('No se encontro el genero.');

    res.send(genre);
});

router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    
    if(!genre) return res.status(404).send('No se encontro el genero.');

    res.send(genres);
});

function validateGenre(genre){
    const schema = {
        name: Joi.string().min(5).required()
    };

    return Joi.validate(genre, schema);
}







module.exports = router;