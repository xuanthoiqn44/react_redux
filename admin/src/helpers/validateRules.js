export default {
    ValidateRules
};

function ValidateRules(props) {
    // console.log(props);
}

ValidateRules.prototype.checkExistString = function (value, self, stringListForCheck, message) {
    return stringListForCheck.includes(value) && value !== self ? message : null;
};

ValidateRules.prototype.checkExistName = function (value, stringListForCheck, message) {
    return stringListForCheck.includes(value) ? message : null;
};

ValidateRules.prototype.checkEmpty = function (value, message) {
    return value === '' ? message : null;
};

ValidateRules.prototype.checkLength = function (value, length, message) {
    return value.length > length ? message : null;
};

ValidateRules.prototype.checkMinMaxLength = function (value, minLength, maxLength, message) {
    return value.length > maxLength || value.length < minLength ? message : null;
};
