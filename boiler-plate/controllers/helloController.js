const getGreeting = require('../usecases/getGreeting');

exports.getGreeting = async (req, res) => {
    try {
        const greeting = await getGreeting(req.params.username);
        res.status(200).send(greeting);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.saveUser = async (req, res) => {
    try {
        await saveUser(req.body);
        res.status(201).send('User saved');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

