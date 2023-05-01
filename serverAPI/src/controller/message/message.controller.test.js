const { mockRequest, mockResponse } = require('jest-mock-req-res');
const messageController = require('./message.controller');
const messageService = require('./message.service');
jest.mock('./message.service.js');

describe('Message controller tests', ()=>{

    let mockData;
    let nextFunction;
    let response;

    beforeEach(()=>{

        mockData = [
            {
                "id": 1,
                "sender": "member1",
                "messageText": "Random mesage text",
                "opened": false,
            },
            {
                "id": 2,
                "sender": "Some member",
                "messageText": "This is my test message text",
                "opened": false,
            },
            {
                "id": 3,
                "sender": "John Doe",
                "messageText": "Hello there!",
                "opened": true,
            },
          
        ];

        messageService.__setMockData(mockData);

        nextFunction = jest.fn();
        response = mockResponse();

    })


    afterEach(() => {
        jest.clearAllMocks();
    });

   
    test('FindById() with valid ID', async ()=>{

        const VALID_MESSAGE_ID = 2;
       
        const request = mockRequest({
            params: {
                id: VALID_MESSAGE_ID
            }
        });

        await messageController.findById(request, response, nextFunction)
        expect(messageService.findById).toBeCalledWith(VALID_MESSAGE_ID);
        expect(messageService.findById).toBeCalledTimes(1);
        expect(response.json).toBeCalledWith(mockData.find(message => message.id === VALID_MESSAGE_ID))

    })

    

    test('findAll()', async() => {
        
        const request = mockRequest();

        await messageController.findAll(request, response, nextFunction)
        expect(messageService.findAll).toBeCalledTimes(1);
        expect(response.json).toBeCalledWith(mockData);
         
    })



    test('create() with valid messageData', async() => {

        const validSavedMessage = {
            id: mockData[mockData.length-1].id + 1,
            sender: "643120476222cd27c864bba8",
            messageText: "Have a nice day!",
            opened: false
        };

        const request = mockRequest({
            body: {
                "sender": validSavedMessage.sender,
                "messageText": validSavedMessage.messageText,
                opened: false
            }
        });

        const saveObj = {
            sender: validSavedMessage.sender,
            messageText: validSavedMessage.messageText,
            opened: false
        };

        await messageController.create(request, response, nextFunction);
        expect(messageService.create).toBeCalledWith(saveObj);
        expect(nextFunction).not.toBeCalled();
        expect(response.json).toBeCalledWith(validSavedMessage);
        expect(response.json).toBeCalledTimes(1);
        expect(response.status).toBeCalledWith(201);
    })



    test('update() message with valid Id', async() => {
        const VALID_MESSAGE_ID = 2;

        const updatedMessage = {
            id: VALID_MESSAGE_ID,
            sender: "Some member",
            messageText: "This is my test message text",
            opened: true
        };

        const request = mockRequest({
            params: {
                id: VALID_MESSAGE_ID
            }
        });

        const saveObj = {
            sender: updatedMessage.sender,
            messageText: updatedMessage.messageText,
            opened: updatedMessage.opened
        };
        
        await messageController.update(request, response, nextFunction);
        expect(messageService.update).toBeCalledWith(VALID_MESSAGE_ID, saveObj);
        expect(nextFunction).not.toBeCalled();
        expect(response.json).toBeCalledWith(updatedMessage);
        expect(response.json).toBeCalledTimes(1);

    })

    


})