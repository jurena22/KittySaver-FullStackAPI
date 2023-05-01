const catService = jest.mock('./cat.service');

let mockData;

catService.__setMockData = data => {
    mockData = data;
}

catService.findById = jest.fn(id => {
    return Promise.resolve(mockData.find(cat => cat.id === id));
})

catService.findAll = jest.fn(()=>{
    return Promise.resolve(mockData);
})

catService.create = jest.fn((newCat)=>{
    const savedCat = {
        ...newCat,
        id: mockData[mockData.length-1].id + 1
    }
    
    mockData.push(savedCat)
    return Promise.resolve(savedCat);
})

catService.update = jest.fn((id, newCatData) =>{
    const catToUpdate = mockData.find(cat => cat.id === id);
    const catIndex = mockData.findIndex(cat => cat.id === id)
    
    mockData[catIndex] = {
        ...catToUpdate,
        ...newCatData
    }

    return Promise.resolve(mockData[catIndex]);
})

catService.delete = jest.fn((id)=>{
    const catIndex = mockData.findIndex(cat => cat.id === id);
    const deletedCat = mockData.splice(catIndex, 1)[0];
    deletedCat._id = deletedCat.id;
    return Promise.resolve(deletedCat);

})

module.exports = catService;