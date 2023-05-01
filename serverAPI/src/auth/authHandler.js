const jwt = require('jsonwebtoken');
const Member = require('../models/member.model');

const refreshDB = [];


exports.login = async (req, res, next) => {
    if (!req.body['email'] || !req.body['password']) {
        return res.status(400).send('Missing email or password');
    }

    const user = await Member.findOne({ email: req.body['email'], password: req.body['password'] })

    if (!user) {
        return res.status(404).send('Invalid email or password');
    }

    const accessToken = jwt.sign({
        email: user.email,
        role: user.role,
        _id: user._id
    }, process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );


    const refreshToken = jwt.sign({
        email: user.email,
        role: user.role,
        _id: user._id
    }, process.env.REFRESH_TOKEN_SECRET_KEY);

    refreshDB.push(refreshToken);

    res.json({
        accessToken, refreshToken, user: {
            email: user.email,
            role: user.role,
            _id: user._id,
            name: user.name
        }
    });
}


exports.refresh = (req, res, next) => {
    const refreshToken = req.body['refreshToken'];

    if (!refreshToken) {
        return res.sendStatus(400);
    }

    const foundToken = refreshDB.includes(refreshToken);

    if (foundToken) {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY, (err, payLoad) => {
            if (err) {
                return res.sendStatus(400);
            }

            const accessToken = jwt.sign({
                username: payLoad.username,
                role: payLoad.role,
                _id: payLoad._id
            },
            process.env.ACCESS_TOKEN_SECRET_KEY, 
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            })

            res.json({ accessToken })
        })
    }else {
        res.sendStatus(400);
    }
}


exports.logout = (req, res, next) => {
    const {refreshToken} = req.body;
    if(!refreshToken){
        return res.sendStatus(400);
    }

    const tokenId = refreshDB.findIndex(t => t === refreshToken);

    if(tokenId >= 0){
        refreshDB.splice(tokenId,1);
        res.status(200).json({});
    }else {
        res.sendStatus(400);
    }

}
