import React from 'react';
export const SPRITE_SIZE = 40;
export const MAP_HEIGHT = SPRITE_SIZE * 10;
export const MAP_WIDTH = SPRITE_SIZE * 20;

export default{
    ValidationRules
};

function ValidationRules(props) {
    //console.log(props);
}

ValidationRules.prototype.checkLength = function(value,length,message){
    return value.length > length ? {hasError:true,error:<div className="error-label">{message}</div>} : {valid:false,error:null};
};

ValidationRules.prototype.checkMinMaxLength = function(value,minLength,maxLength,message){
    return value.length > maxLength || value.length < minLength ? {
        hasError:true,error:<div className="error-label">{message}</div>} : {valid:false,error:null};
};