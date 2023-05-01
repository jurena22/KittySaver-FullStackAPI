const { mockRequest, mockResponse } = require('jest-mock-req-res');
const createError = require('http-errors');
const catController = require('./cat.controller');
const catService = require('./cat.service');
jest.mock('./cat.service.js');

describe('Cat controller tests', ()=>{

    let mockData;
    let nextFunction;
    let response;

    beforeEach(()=>{

        mockData = [
            {
                "id": 1,
                "name": "Charlie",
                "sex": "Male",
                "color": "tabby",
                "description": "Instantly break out into full speed gallop across the house for no reason. Stare out cat door then go back inside",
                "imgUrl": "https://images.unsplash.com/photo-1659576334325-ddf78fe1f7f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=80",
                "adoptable": false
            },
            {
                "id": 2,
                "name": "Oscar",
                "sex": "Male",
                "color": "orange",
                "description": "Stare at the wall, play with food and get confused by dust stand in doorway, unwilling to chose whether to stay in or go out",
                "imgUrl": "https://images.unsplash.com/photo-1622273413879-eded127f7fb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
                "adoptable": false
            },
            {
                "id": 3,
                "name": "Lima",
                "sex": "Male",
                "color": "bicolor",
                "description": "Scratch leg; meow for can opener to feed me milk the cow you are a captive audience while sitting on the toilet, pet me",
                "imgUrl": "https://images.unsplash.com/photo-1634115570696-cfaef92944f7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
                "adoptable": false
            },
            {
                "id": 4,
                "name": "Sierra Lima",
                "sex": "Female",
                "color": "tabby",
                "description": "Meow meow you are my owner so here is a dead bird love to play with owner's hair tie or be superior and yowling nonstop the whole night",
                "imgUrl": "https://images.unsplash.com/photo-1557408938-0f220f49bca1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
                "adoptable": false
            },
            {
                "id": 5,
                "name": "Charlie Kilo",
                "sex": "Female",
                "color": "bicolor",
                "description": "Stare at wall turn and meow stare at wall some more meow again continue staring or refuse to leave cardboard box",
                "imgUrl": "https://images.unsplash.com/photo-1623985153974-70b07d6a279e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
                "adoptable": false
            }
        ];

        catService.__setMockData(mockData);

        nextFunction = jest.fn();
        response = mockResponse();

    })


    afterEach(() => {
        jest.clearAllMocks();
    });

    test('FindById() with valid ID', async ()=>{

        const VALID_CAT_ID = 5;
       
        const request = mockRequest({
            params: {
                id: VALID_CAT_ID
            }
        });

        await catController.findById(request, response, nextFunction)
        expect(catService.findById).toBeCalledWith(VALID_CAT_ID);
        expect(catService.findById).toBeCalledTimes(1);
        expect(response.json).toBeCalledWith(mockData.find(cat => cat.id === VALID_CAT_ID))
        

    })

    test('findById() with invalid ID', async () => {
        const INVALID_CAT_ID = 7;

        const request = mockRequest({
            params: {
                id: INVALID_CAT_ID
            }
        });

        await catController.findById(request, response, nextFunction)
        expect(catService.findById).toBeCalledWith(INVALID_CAT_ID);
        expect(catService.findById).toBeCalledTimes(1);
        expect(response.json).not.toBeCalled();
        expect(nextFunction).toBeCalledWith(new createError.NotFound(`Cat with ${INVALID_CAT_ID} is not found`));

    })



    test('findAll()', async() => {
        
        const request = mockRequest();

        await catController.findAll(request, response, nextFunction)
        expect(catService.findAll).toBeCalledTimes(1);
        expect(response.json).toBeCalledWith(mockData);
         
    })



    test('create() with valid catData', async() => {

        const validSavedCat = {
            id: mockData[mockData.length-1].id + 1,
            name: "Some test cat",
            sex: "Male",
            color: "black",
            description: "Catty ipsum goes here",
            imgUrl: "https://images.unsplash.com/photo-1503431128871-cd250803fa41?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
            adoptable: false
      
        };

        const request = mockRequest({
            body: {
                "name": validSavedCat.name,
                "sex": validSavedCat.sex,
                "color": validSavedCat.color,
                "description": validSavedCat.description,
                "imgUrl": validSavedCat.imgUrl,
                "adoptable": validSavedCat.adoptable
            }
        });

        const saveObj = {
            name: validSavedCat.name,
            sex: validSavedCat.sex,
            color: validSavedCat.color,
            description: validSavedCat.description,
            imgUrl: validSavedCat.imgUrl,
            adoptable: validSavedCat.adoptable
        };

        await catController.create(request, response, nextFunction);
        expect(catService.create).toBeCalledWith(saveObj);
        expect(nextFunction).not.toBeCalled();
        expect(response.json).toBeCalledWith(validSavedCat);
        expect(response.json).toBeCalledTimes(1);
        expect(response.status).toBeCalledWith(201);
    })



    test('update() cat with valid Id', async() => {
        const VALID_CAT_ID = 5;

        const updatedCat = {
            id: VALID_CAT_ID,
            name: "Changed test cat name",
            sex: "Male",
            color: "black",
            description: "Catty ipsum goes here",
            imgUrl: "https://images.unsplash.com/photo-1503431128871-cd250803fa41?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
            adoptable: false
      
        };

        const request = mockRequest({
            params: {
                id: VALID_CAT_ID
            },
            body: {
                "name": updatedCat.name,
                "sex": updatedCat.sex,
                "color": updatedCat.color,
                "description": updatedCat.description,
                "imgUrl": updatedCat.imgUrl,
                "adoptable": updatedCat.adoptable
            }
        });

        const saveObj = {
            name: updatedCat.name,
            sex: updatedCat.sex,
            color: updatedCat.color,
            description: updatedCat.description,
            imgUrl: updatedCat.imgUrl,
            adoptable: updatedCat.adoptable
        };
        
        await catController.update(request, response, nextFunction);
        expect(catService.update).toBeCalledWith(VALID_CAT_ID, saveObj);
        expect(nextFunction).not.toBeCalled();
        expect(response.json).toBeCalledWith(updatedCat);
        expect(response.json).toBeCalledTimes(1);

    })

    

    test('delete() with valid catId', async() => {  
        const VALID_CAT_ID = 5;
       
        const request = mockRequest({
            params: {
                id: VALID_CAT_ID
            }
        });

        const deletedCat = {
            _id: VALID_CAT_ID,

        }

        await catController.delete(request, response, nextFunction)
        expect(catService.delete).toBeCalledWith(VALID_CAT_ID);
        expect(catService.delete).toBeCalledTimes(1);
        expect(response.json).toBeCalledWith(deletedCat);
    })



})