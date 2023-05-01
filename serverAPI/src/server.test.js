require('dotenv').config();
const app = require('./server');
const mongoose = require('mongoose');
const supertest = require('supertest');
const Cat = require('./models/cat.model');
const Member = require('./models/member.model');
const Message = require('./models/message.model');


describe('REST API integration tests', () => {

    let ACCESS_TOKEN;
    let REFRESH_TOKEN;

    const insertData = {
        cats: [
            {
                "name": "Test Cat 1",
                "sex": "Male",
                "color": "tabby",
                "description": "Instantly break out into full speed gallop across the house for no reason. Stare out cat door then go back inside",
                "imgUrl": "https://images.unsplash.com/photo-1659576334325-ddf78fe1f7f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=80",
                "adoptable": false
            },
            {
                "name": "Test Cat 2",
                "sex": "Male",
                "color": "orange",
                "description": "Stare at the wall, play with food and get confused by dust stand in doorway, unwilling to chose whether to stay in or go out",
                "imgUrl": "https://images.unsplash.com/photo-1622273413879-eded127f7fb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
                "adoptable": false
            },
            {
                "name": "Test Cat 3",
                "sex": "Male",
                "color": "bicolor",
                "description": "Scratch leg; meow for can opener to feed me milk the cow you are a captive audience while sitting on the toilet, pet me",
                "imgUrl": "https://images.unsplash.com/photo-1634115570696-cfaef92944f7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
                "adoptable": false
            }
        ],
        members: [
            {
                name: "Teszt Elek",
                phoneNumber: "06901234567",
                address: "NY Short street 3",
                email: "test@mail.com",
                password: "tester1",
                role: "MEMBER",
                messages: []
            },
            {
                name: "Admin Tesztel",
                phoneNumber: "06907654321",
                address: "Paris Av. des Champs Elysées 178",
                email: "admintester@mail.com",
                password: "admin1",
                role: "ADMIN",
                messages: []
            },
            {
                name: "John Doe",
                phoneNumber: "0630123457",
                address: "London Bridge str. 65",
                email: "jdoe@testmail.com",
                password: "johnny",
                role: "MEMBER",
                messages: []
            }
        ],
        messages: [
            {
                sender: "643bf4ec170e3e3f5e309084",
                messageText: "Have a nice day!",
                opened: false
            },
            {
                sender: "643bf4ec170e3e3f5e309084",
                messageText: "Another test message from random user to admin",
                opened: false
            }

        ]
    };

    beforeEach(async () => {
        await mongoose.connect('mongodb://localhost:27017/KittySaverTestDB');
        console.log('MongoDB connection established!');
    })

    afterEach(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
    })

    //authentication tests
    test('POST /login endpoint does login with valid data', async () => {
        await Member.insertMany(insertData.members);

        const response = await supertest(app)
            .post('/api/login')
            .send({
                "email": "admintester@mail.com", "password": "admin1"
            })
    
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeTruthy();
        expect(response.body.accessToken).toBeTruthy();
        expect(response.body.refreshToken).toBeTruthy();
        expect(response.body.user).toBeTruthy();
        expect(response.body.user.email).toBe("admintester@mail.com");
       
    })

    test('POST /refresh endpoint does return refreshToken for logged in user', async () => {
        await Member.insertMany(insertData.members);

        await supertest(app)
            .post('/api/login')
            .send({
                "email": "admintester@mail.com", "password": "admin1"
            }).then(res => {
                ACCESS_TOKEN = res.body.accessToken;
                REFRESH_TOKEN = res.body.refreshToken;
            })

        const response = await supertest(app)
            .post('/api/refresh')
            .send({
                "refreshToken": `${REFRESH_TOKEN}`
            })


        expect(response.statusCode).toBe(200);
        expect(response.body).toBeTruthy();
        expect(response.body.accessToken).toBeTruthy();
        expect(response.body.accessToken).not.toBe(ACCESS_TOKEN);   
    })

    test('POST /logout endpoint does return 200 for logged in user', async () => {
        await Member.insertMany(insertData.members);

        await supertest(app)
            .post('/api/login')
            .send({
                "email": "admintester@mail.com", "password": "admin1"
            }).then(res => {
                ACCESS_TOKEN = res.body.accessToken;
                REFRESH_TOKEN = res.body.refreshToken;
            })

        const response = await supertest(app)
            .post('/api/logout')
            .send({
                "refreshToken": `${REFRESH_TOKEN}`
            })


        expect(response.statusCode).toBe(200);
       
        const result = await supertest(app)
        .post('/api/refresh')
        .send({
            "refreshToken": `${REFRESH_TOKEN}`
        })
        expect(result.statusCode).toBe(400);  
    })


    //CAT endpoint tests
    test('GET /cat endpoint does return cat list', async () => {
        await Cat.insertMany(insertData.cats);

        const response = await supertest(app).get('/api/cat')

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBe(insertData.cats.length);

        response.body.forEach((cat, index) => {
            expect(cat.name).toBe(insertData.cats[index].name)
            expect(cat.sex).toBe(insertData.cats[index].sex)
            expect(cat.color).toBe(insertData.cats[index].color)
            expect(cat.description).toBe(insertData.cats[index].description)
            expect(cat.imgUrl).toBe(insertData.cats[index].imgUrl)
            expect(cat.adoptable).toBe(insertData.cats[index].adoptable)
        })
    })

    test('GET /cat/:id endpoint does return cat data', async () => {
        const testCats = await Cat.insertMany(insertData.cats);
        const VALID_CAT_ID = testCats[0]._id.toString();

        const response = await supertest(app).get(`/api/cat/${VALID_CAT_ID}`)

        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(VALID_CAT_ID);
        expect(response.body.name).toBe(testCats[0].name);
        expect(response.body.sex).toBe(testCats[0].sex);
        expect(response.body.color).toBe(testCats[0].color);
        expect(response.body.description).toBe(testCats[0].description);
        expect(response.body.imgUrl).toBe(testCats[0].imgUrl);
        expect(response.body.adoptable).toBe(testCats[0].adoptable);

    })

    test('POST /cat endpoint does save a new cat with valid data by admin', async () => {
        await Cat.insertMany(insertData.cats);
        await Member.insertMany(insertData.members);

        const postData = {
            name: "Testy",
            sex: "Neutered",
            color: "tabby",
            description: "The cutest test cat",
            imgUrl: "http://image.com/1234",
            adoptable: false
        }

        await supertest(app)
            .post('/api/login')
            .send({
                "email": "admintester@mail.com", "password": "admin1"
            }).then(res => {
                ACCESS_TOKEN = res.body.accessToken;
                REFRESH_TOKEN = res.body.refreshToken;
            })

        const response = await supertest(app)
            .post('/api/cat')
            .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
            .send(postData)

        expect(response.statusCode).toBe(201);
        expect(response.body._id).toBeTruthy();
        expect(response.body.name).toBe(postData.name);
        expect(response.body.sex).toBe(postData.sex);
        expect(response.body.color).toBe(postData.color);
        expect(response.body.description).toBe(postData.description);
        expect(response.body.imgUrl).toBe(postData.imgUrl);
        expect(response.body.adoptable).toBe(postData.adoptable);

        const catId = response.body._id;
        const result = await supertest(app).get(`/api/cat/${catId}`);
        expect(result.statusCode).toBe(200);
        expect(result.body._id).toBe(catId);
        expect(result.body).toEqual(response.body);
    })


    test('PUT /cat/:id endpoint does update a cat by admin', async () => {
        const testCats = await Cat.insertMany(insertData.cats);
        const VALID_CAT_ID = testCats[0]._id.toString();

        await Member.insertMany(insertData.members);

        const postData = {
            name: "Changed to Testy"
        }

        await supertest(app)
            .post('/api/login')
            .send({
                "email": "admintester@mail.com", "password": "admin1"
            }).then(res => {
                ACCESS_TOKEN = res.body.accessToken;
                REFRESH_TOKEN = res.body.refreshToken;
            })

        const response = await supertest(app)
            .put(`/api/cat/${VALID_CAT_ID}`)
            .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
            .send(postData)

        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(VALID_CAT_ID);
        expect(response.body.name).toBe(postData.name);
        expect(response.body.sex).toBe(testCats[0].sex);
        expect(response.body.color).toBe(testCats[0].color);
        expect(response.body.description).toBe(testCats[0].description);
        expect(response.body.imgUrl).toBe(testCats[0].imgUrl);
        expect(response.body.adoptable).toBe(testCats[0].adoptable);

        const result = await supertest(app).get(`/api/cat/${VALID_CAT_ID}`);
        expect(result.statusCode).toBe(200);
        expect(result.body._id).toBe(VALID_CAT_ID);
        expect(result.body).toEqual(response.body);
    })


    test('DELETE /cat/:id endpoint does delete a cat by admin', async () => {
        await Member.insertMany(insertData.members);
        const testCats = await Cat.insertMany(insertData.cats);
        const catId = testCats[0]._id.toString();

        await supertest(app)
            .post('/api/login')
            .send({
                "email": "admintester@mail.com", "password": "admin1"
            }).then(res => {
                ACCESS_TOKEN = res.body.accessToken;
                REFRESH_TOKEN = res.body.refreshToken;
            })

        const response = await supertest(app)
            .delete(`/api/cat/${catId}`)
            .set('Authorization', `Bearer ${ACCESS_TOKEN}`);

        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(catId);

        const result = await supertest(app).get(`/api/cat/${catId}`);
        expect(result.statusCode).toBe(404);
        expect(result.body.hasError).toBe(true);
        expect(result.body.message).toBe(`Cat with ${catId} is not found`);
    });

    //MEMBER endpoint tests
    test('GET /member endpoint as admin does return member list', async () => {
        await Member.insertMany(insertData.members);

        await supertest(app)
            .post('/api/login')
            .send({
                "email": "admintester@mail.com", "password": "admin1"
            }).then(res => {
                ACCESS_TOKEN = res.body.accessToken;
                REFRESH_TOKEN = res.body.refreshToken;
            })

        const response = await supertest(app)
            .get('/api/member')
            .set('Authorization', `Bearer ${ACCESS_TOKEN}`);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBe(insertData.members.length);

        response.body.forEach((member, index) => {
            expect(member.name).toBe(insertData.members[index].name)
            expect(member.phoneNumber).toBe(insertData.members[index].phoneNumber)
            expect(member.address).toBe(insertData.members[index].address)
            expect(member.email).toBe(insertData.members[index].email)
            expect(member.role).toBe(insertData.members[index].role)
            expect(member.password).toBe(insertData.members[index].password)
            expect(member.messages).toEqual(insertData.members[index].messages)
        })
    });

    test('GET /member endpoint as user does return 403', async () => {
        await Member.insertMany(insertData.members);

        await supertest(app)
            .post('/api/login')
            .send({
                "email": "test@mail.com", "password": "tester1"
            }).then(res => {
                ACCESS_TOKEN = res.body.accessToken;
                REFRESH_TOKEN = res.body.refreshToken;
            })

        const response = await supertest(app)
            .get('/api/member')
            .set('Authorization', `Bearer ${ACCESS_TOKEN}`);

        expect(response.statusCode).toBe(403);
    })

    test('GET /member/:id endpoint does return own data', async () => {
        const testUsers = await Member.insertMany(insertData.members);
        const userId = testUsers[0]._id.toString();

        await supertest(app)
            .post('/api/login')
            .send({
                "email": `${testUsers[0].email}`, "password": `${testUsers[0].password}`
            }).then(res => {
                ACCESS_TOKEN = res.body.accessToken;
                REFRESH_TOKEN = res.body.refreshToken;
            })

        const response = await supertest(app)
            .get(`/api/member/${userId}`)
            .set('Authorization', `Bearer ${ACCESS_TOKEN}`);

        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(userId);
        expect(response.body.name).toBe(testUsers[0].name);
        expect(response.body.phoneNumber).toBe(testUsers[0].phoneNumber);
        expect(response.body.email).toBe(testUsers[0].email);
        expect(response.body.address).toBe(testUsers[0].address);
        expect(response.body.role).toBe(testUsers[0].role);
        expect(response.body.password).toBe(testUsers[0].password);
        expect(response.body.messages).toEqual(testUsers[0].messages);
    });

    test('GET /member/:id endpoint does return 403 for member if not own id', async () => {

        const testUsers = await Member.insertMany(insertData.members);
        const otherId = testUsers[1]._id.toString();

        await supertest(app)
            .post('/api/login')
            .send({
                "email": `${testUsers[0].email}`, "password": `${testUsers[0].password}`
            }).then(res => {
                ACCESS_TOKEN = res.body.accessToken;
                REFRESH_TOKEN = res.body.refreshToken;
            })

        const response = await supertest(app)
            .get(`/api/member/${otherId}`)
            .set('Authorization', `Bearer ${ACCESS_TOKEN}`);

        expect(response.statusCode).toBe(403);
    });

    test('GET /member/:id endpoint does return data for admin if not own id', async () => {

        const testUsers = await Member.insertMany(insertData.members);
        const otherId = testUsers[0]._id.toString();

        await supertest(app)
            .post('/api/login')
            .send({
                "email": `${testUsers[1].email}`, "password": `${testUsers[1].password}`
            }).then(res => {
                ACCESS_TOKEN = res.body.accessToken;
                REFRESH_TOKEN = res.body.refreshToken;
            })

        const response = await supertest(app)
            .get(`/api/member/${otherId}`)
            .set('Authorization', `Bearer ${ACCESS_TOKEN}`);

        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(otherId);
        expect(response.body.name).toBe(testUsers[0].name);
        expect(response.body.phoneNumber).toBe(testUsers[0].phoneNumber);
        expect(response.body.email).toBe(testUsers[0].email);
        expect(response.body.address).toBe(testUsers[0].address);
        expect(response.body.role).toBe(testUsers[0].role);
        expect(response.body.password).toBe(testUsers[0].password);
        expect(response.body.messages).toEqual(testUsers[0].messages);
    });

    test('POST /member endpoint test does successful registration with valid data', async () => {
        await Member.insertMany(insertData.members);

        const postData = {
            name: "Új Ember",
            phoneNumber: "0610020003",
            address: "Budapest Üllői út 71",
            email: "ember@example.com",
            password: "m_ember"
        }

        const response = await supertest(app).post(`/api/member`).send(postData)
        expect(response.statusCode).toBe(201);
        expect(response.body._id).toBeTruthy();
        expect(response.body.name).toBe(postData.name);
        expect(response.body.email).toBe(postData.email);
        expect(response.body.phoneNumber).toBe(postData.phoneNumber);
        expect(response.body.address).toBe(postData.address);
        expect(response.body.password).toBe(postData.password);
        expect(response.body.role).toBe("MEMBER");

    })

    test('PUT /member/:id endpoint does update member data by member', async () => {
        const testUsers = await Member.insertMany(insertData.members);
        const userId = testUsers[0]._id.toString();

        await supertest(app)
            .post('/api/login')
            .send({
                "email": `${testUsers[0].email}`, "password": `${testUsers[0].password}`
            }).then(res => {
                ACCESS_TOKEN = res.body.accessToken;
                REFRESH_TOKEN = res.body.refreshToken;
            })

        const postData = {
            name: "Frissített Ember"
        }

        const response = await supertest(app)
            .put(`/api/member/${userId}`)
            .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
            .send(postData)

        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(userId);
        expect(response.body.name).toBe(postData.name);
        expect(response.body.email).toBe(testUsers[0].email);
        expect(response.body.phoneNumber).toBe(testUsers[0].phoneNumber);
        expect(response.body.address).toBe(testUsers[0].address);
        expect(response.body.password).toBe(testUsers[0].password);
        expect(response.body.role).toBe(testUsers[0].role);
    })

    test('DELETE /member/:id endpoint does delete user by admin', async () => {

        const testUsers = await Member.insertMany(insertData.members);
        const userId = testUsers[0]._id.toString();

        await supertest(app)
            .post('/api/login')
            .send({
                "email": `${testUsers[1].email}`, "password": `${testUsers[1].password}`
            }).then(res => {
                ACCESS_TOKEN = res.body.accessToken;
                REFRESH_TOKEN = res.body.refreshToken;
            })

        const response = await supertest(app)
            .delete(`/api/member/${userId}`)
            .set('Authorization', `Bearer ${ACCESS_TOKEN}`);

        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(userId);
    });



    //MESSAGE endpoint tests
    test('GET /message endpoint as admin does return message list', async () => {
        await Member.insertMany(insertData.members);
        await Message.insertMany(insertData.messages);

        await supertest(app)
            .post('/api/login')
            .send({
                "email": "admintester@mail.com", "password": "admin1"
            }).then(res => {
                ACCESS_TOKEN = res.body.accessToken;
                REFRESH_TOKEN = res.body.refreshToken;
            })

        const response = await supertest(app)
            .get('/api/message')
            .set('Authorization', `Bearer ${ACCESS_TOKEN}`);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBe(insertData.messages.length);

        response.body.forEach((message, index) => {
            expect(message.messageText).toBe(insertData.messages[index].messageText)
            expect(message.opened).toBe(insertData.messages[index].opened)
        })
    });

    test('GET /message/:id endpoint as admin does return message data', async () => {
        await Member.insertMany(insertData.members);
        const testMessages = await Message.insertMany(insertData.messages);
        const messageId = testMessages[0]._id.toString();

        await supertest(app)
            .post('/api/login')
            .send({
                "email": "admintester@mail.com", "password": "admin1"
            }).then(res => {
                ACCESS_TOKEN = res.body.accessToken;
                REFRESH_TOKEN = res.body.refreshToken;
            })

        const response = await supertest(app)
            .get(`/api/message/${messageId}`)
            .set('Authorization', `Bearer ${ACCESS_TOKEN}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeTruthy();
        expect(response.body.messageText).toBe(testMessages[0].messageText);
        expect(response.body.opened).toBe(false);
       
    });

    test('POST /message endpoint does send a message to admin by member', async () => {
        const testUsers = await Member.insertMany(insertData.members);
        const messageSender = testUsers[2];
        await Message.insertMany(insertData.messages);

        const postData = {
            sender: `${messageSender._id.toString()}`,
            messageText: "Something nice"
        }


        await supertest(app)
            .post('/api/login')
            .send({
                "email": `${messageSender.email}`, "password": `${messageSender.password}`
            }).then(res => {
                ACCESS_TOKEN = res.body.accessToken;
                REFRESH_TOKEN = res.body.refreshToken;
            })

        const response = await supertest(app)
            .post('/api/message')
            .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
            .send(postData)

        expect(response.statusCode).toBe(201);
        expect(response.body._id).toBeTruthy();
        expect(response.body.sender).toBe(`${messageSender._id.toString()}`);
        expect(response.body.messageText).toBe(postData.messageText);
        expect(response.body.opened).toBe(false);

    })

    test('PUT /message/:id endpoint does change opened property of message to true by admin', async () => {
        await Member.insertMany(insertData.members);
        const testMessages = await Message.insertMany(insertData.messages);
        const messageId = testMessages[0]._id.toString();

        await supertest(app)
            .post('/api/login')
            .send({
                "email": "admintester@mail.com", "password": "admin1"
            }).then(res => {
                ACCESS_TOKEN = res.body.accessToken;
                REFRESH_TOKEN = res.body.refreshToken;
            })

        const response = await supertest(app)
            .put(`/api/message/${messageId}`)
            .set('Authorization', `Bearer ${ACCESS_TOKEN}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeTruthy();
        expect(response.body.messageText).toBe(testMessages[0].messageText);
        expect(response.body.opened).toBe(true);
       
    });

})
