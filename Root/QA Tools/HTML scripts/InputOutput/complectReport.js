
function logReport(type,testName, list) {
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
        default:
        
            break;
    }
}
function tableReport(testName, list) {    
    let result = '🔴 Faild';
    let log = ""
    if (list?.length) log = `${testName}: ${list.join(', ')}`;
    else result = '🟢 Succeed'
    return [result, testName, log]
}

module.exports = {logReport, tableReport};