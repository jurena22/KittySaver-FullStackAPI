const memberService = jest.mock('./member.service');

let mockData;

memberService.__setMockData = data => {
    mockData = data;
}

memberService.findById = jest.fn(id => {
    return Promise.resolve(mockData.find(member => member.id === id));
})

memberService.findAll = jest.fn(()=>{
    return Promise.resolve(mockData);
})

memberService.create = jest.fn((newMember)=>{
    const savedMember = {
        ...newMember,
        id: mockData[mockData.length-1].id + 1
    }
    
    mockData.push(savedMember)
    return Promise.resolve(savedMember);
})

memberService.update = jest.fn((id, newMemberData) =>{
    const memberToUpdate = mockData.find(member => member.id === id);
    const memberIndex = mockData.findIndex(member => member.id === id)
    
    mockData[memberIndex] = {
        ...memberToUpdate,
        ...newMemberData
    }

    return Promise.resolve(mockData[memberIndex]);
})

memberService.delete = jest.fn((id)=>{
    const memberIndex = mockData.findIndex(member => member.id === id);
    const deletedMember = mockData.splice(memberIndex, 1)[0];
    deletedMember._id = deletedMember.id;
    return Promise.resolve(deletedMember);

})

module.exports = memberService;
