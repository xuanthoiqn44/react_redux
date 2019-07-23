import React from 'react';
const styledComponent = (Component) => ({className , refChild , ...rest}) => {
    return (
        <div className={className}>
            <Component {...rest} ref={refChild}/>
        </div>
    )
};

export default styledComponent;