/**
* Represents an issue found during validation.
* @typedef {Object} Issue
* @property {string} issueType - The type of issue ('bug', 'info').
* @property {string} validationType - The type of validation that was performed.
* @property {number} line - The line number where the issue was found.
* @property {boolean} valid - Whether the validation passed or failed.
* @property {string} message - A descriptive message about the issue.
 */
const issue = {
    issueType: '',
    validationType: '',
    line: 0,
    valid: true,
    message: ''
};

/**
 * List of regEx for validation
 */
const regExs = ["<%=([^>]*)<%", "%[0-9].*"]; 




module.exports = {issue, regExs}