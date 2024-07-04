function sortAndGroupByValidationType(data) {
    // unique validationTypes
    const grouped = {};
    try {
        data.forEach(item => {
            const { validationType, line, message } = item;
            if (!grouped[validationType]) {
                grouped[validationType] = [];
            }
    
            // construct new grouped object
            grouped[validationType].push(message !== '' ? `in ${line}: ${message}` : line);
        });
    
        // object 'grouped' to array 
        const result = Object.keys(grouped).map(validationType => {
            return {
                validationType: validationType,
                messages: grouped[validationType]
            };
        });
    
        return result;
    } catch (error) {
        console.log(error)
    }
}


// const data = [
//     {
//         issueType: 'bug',
//         validationType: 'links',
//         line: 21,
//         valid: false,
//         message: ''
//     },
//     {
//         issueType: 'bug',
//         validationType: 'image src',
//         line: 14,
//         valid: false,
//         message: ''
//     },
//     {
//         issueType: 'bug',
//         validationType: 'image src',
//         line: 20,
//         valid: false,
//         message: ''
//     }
// ];

function logIssue(data, issueType = 'bug'){
    if(!data) {
        console.error('err');
        return;
    }
    const sortedAndGrouped = sortAndGroupByValidationType(data);
    sortedAndGrouped.forEach((repObject) => {
        
        const indicator = issueType === 'bug' ? '🔴' : issueType === 'info' ? '🟢' : '🟣';
        const line = `${indicator} ${repObject.validationType}: ${repObject.messages.join(', ')}`;
        console.log(line);
    });
}

module.exports = {logIssue}