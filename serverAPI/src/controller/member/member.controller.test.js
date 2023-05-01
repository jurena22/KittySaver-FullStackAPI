const { mockRequest, mockResponse } = require('jest-mock-req-res');
const memberController = require('./member.controller');
const memberService = require('./member.service');
jest.mock('./member.service.js');

describe('Member controller tests', ()=>{

    let mockData;
    let nextFunction;
    let response;

    beforeEach(()=>{

        mockData = [
            {
                "id": 1,
                "name": "John Doe",
                "phoneNumber": "+351020304050",
                "address": "Best Street 2 New Jersey",
                "email": "jdoe@mail.com",
                "password": "123456"
            },
            {
                "id": 2,
                "name": "Jane Doe",
                "phoneNumber": "+351020304051",
                "address": "Best Street 2 New Jersey",
                "email": "janedoe@mail.com",
                "password": "12345"
            },
            {
                "id": 3,
                "name": "Test Doe",
                "phoneNumber": "+36301234567",
                "address": "New York Test street 3",
                "email": "test@mail.com",
                "password": "pw123"
            }
        ];

        memberService.__setMockData(mockData);

        nextFunction = jest.fn();
        response = mockResponse();

    })


    afterEach(() => {
        jest.clearAllMocks();
    });

    
    test('FindById() with valid ID', async ()=>{

        const VALID_MEMBER_ID = 3;
       
        const request = mockRequest({
            params: {
                id: VALID_MEMBER_ID
            }
        });

        await memberController.findById(request, response, nextFunction)
        expect(memberService.findById).toBeCalledWith(VALID_MEMBER_ID);
        expect(memberService.findById).toBeCalledTimes(1);
        expect(response.json).toBeCalledWith(mockData.find(m => m.id === VALID_MEMBER_ID))
        
    })


    test('findAll()', async() => {
        
        const request = mockRequest();

        await memberController.findAll(request, response, nextFunction)
        expect(memberService.findAll).toBeCalledTimes(1);
        expect(response.json).toBeCalledWith(mockData);
         
    })



    test('create() with valid memberData', async() => {

        const validSavedPerson = {
            id: mockData[mockData.length-1].id + 1,
            role: "MEMBER",
            name: "Some test member",
            phoneNumber: "+36907654321",
            address: "Budapest Fő utca 2",
            email: "newtest@mail.com",
            password: "nt_pw"
      
        };

        const request = mockRequest({
            body: {
                "name": validSavedPerson.name,
                "phoneNumber": validSavedPerson.phoneNumber,
                "address": validSavedPerson.address,
                "email": validSavedPerson.email,
                "password": validSavedPerson.password
            }
        });

        const saveObj = {
            name: validSavedPerson.name,
            phoneNumber: validSavedPerson.phoneNumber,
            address: validSavedPerson.address,
            email: validSavedPerson.email,
            password: validSavedPerson.password,
            role: "MEMBER"
        };

        await memberController.create(request, response, nextFunction);
        expect(memberService.create).toBeCalledWith(saveObj);
        expect(nextFunction).not.toBeCalled();
        expect(response.json).toBeCalledWith(validSavedPerson);
        expect(response.json).toBeCalledTimes(1);
        expect(response.status).toBeCalledWith(201);
    })



    test('update() with valid Id', async() => {
        const VALID_MEMBER_ID = 3;

        const updatedMember = {
            id: VALID_MEMBER_ID,
            name: "Some test member",
            phoneNumber: "+3617654321",
            address: "Budapest Őz utca 3",
            email: "sometest@mail.com",
            password: "my_pw"
        };

        const request = mockRequest({
            params: {
                id: VALID_MEMBER_ID
            },
            body: {
                "name": updatedMember.name,
                "phoneNumber": updatedMember.phoneNumber,
                "address": updatedMember.address,
                "email": updatedMember.email,
                "password": updatedMember.password
            }
        });

        const saveObj = {
            name: updatedMember.name,
            phoneNumber: updatedMember.phoneNumber,
            address: updatedMember.address,
            email: updatedMember.email,
            password: updatedMember.password
        };
        
        await memberController.update(request, response, nextFunction);
        expect(memberService.update).toBeCalledWith(VALID_MEMBER_ID, saveObj);
        expect(nextFunction).not.toBeCalled();
        expect(response.json).toBeCalledWith(updatedMember);
        expect(response.json).toBeCalledTimes(1);

    })

    

    test('delete() with valid memberId', async() => {  
        const VALID_MEMBER_ID = 3;
       
        const request = mockRequest({
            params: {
                id: VALID_MEMBER_ID
            }
        });

        const deletedMember = {
            _id: VALID_MEMBER_ID,

        }

        await memberController.delete(request, response, nextFunction)
        expect(memberService.delete).toBeCalledWith(VALID_MEMBER_ID);
        expect(memberService.delete).toBeCalledTimes(1);
        expect(response.json).toBeCalledWith(deletedMember);
    })



})