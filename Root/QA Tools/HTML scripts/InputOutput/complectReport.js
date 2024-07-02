
function logReport(type,testName, list, message = '') {
    switch(type){
        case "tag":
        case 'regex':
            if (list?.length) console.log(`🔴 Faild:    ${testName}: ${list.join(', ')}`);
            else console.log(`🟢 Succeed:  ${testName}`);
            break;
        case 'list':
        case "images":
            if (list?.length) console.log(`🟢 Succeed:  ${testName} availability: ${list.join(',')}`);
            else console.log(`🔴 Faild:    ${testName} availability: no ${testName} found`);
            break;
        case 'value':
            if (message) console.log(`🟢 Succeed:  ${testName}: ${message}`);
            else console.log(`🔴 Faild:    ${testName}: missing ${testName}`);
            break;
        default:
        
            break;
    }
}
// function logReport(type,testName, message=  '') {
//             if (message) console.log(`🟢 Succeed:  ${testName}: ${message}`);
//             else console.log(`🔴 Faild:    ${testName}: missing ${testName}`);
          
// }

function tableReport(testName, list) {    
    let result = '🔴 Faild';
    let log = ""
    if (list?.length) log = `${testName}: ${list.join(', ')}`;
    else result = '🟢 Succeed'
    return [result, testName, log]
}

module.exports = {logReport, tableReport};