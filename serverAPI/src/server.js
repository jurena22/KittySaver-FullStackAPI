require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const logger = require('./config/logger');
const cors = require('cors');
const authHandler = require('./auth/authHandler');
const { join } = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/swagger.yaml');

const angularAppPath = join(__dirname, '..', 'public', 'angular');

const app = express();

const apiWrapper = express();
apiWrapper.use('/api', app);

app.use(morgan('combined', {stream: { write: (message) => logger.info(message)}}));

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post('/login', authHandler.login);
app.post('/refresh', authHandler.refresh);
app.post('/logout', authHandler.logout);

app.use('/cat', require('./controller/cat/cat.routes'));
app.use('/member', require('./controller/member/member.routes'));
app.use('/message', require('./controller/message/message.routes'));

apiWrapper.use('/', express.static(angularAppPath));
apiWrapper.get('*', (req,res)=>{
    res.sendFile(angularAppPath + '/index.html')
})

app.use((err, req, res, next)=> {
    logger.error(`ERROR ${err.statusCode}: ${err.message}`);
    res.status(err.statusCode);
    res.json({
        hasError: true,
        message: err.message
    })
})


module.exports = apiWrapper