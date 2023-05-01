const messageService = jest.mock('./message.service');

let mockData;

messageService.__setMockData = data => {
    mockData = data;
}

messageService.findById = jest.fn(id => {
    return Promise.resolve(mockData.find(message => message.id === id));
})

messageService.findAll = jest.fn(()=>{
    return Promise.resolve(mockData);
})

messageService.create = jest.fn((newMessage)=>{

    const savedMessage = {
        ...newMessage,
        id: mockData[mockData.length-1].id + 1
    }
    
    mockData.push(savedMessage)
    return Promise.resolve(savedMessage);
})

messageService.update = jest.fn((id, newMessageData) =>{
    const messageToUpdate = mockData.find(m => m.id === id);
    const messageIndex = mockData.findIndex(message => message.id === id)

    mockData[messageIndex] = {
        ...messageToUpdate,
        ...newMessageData
    }

    return Promise.resolve(mockData[messageIndex]);
})


module.exports = messageService;