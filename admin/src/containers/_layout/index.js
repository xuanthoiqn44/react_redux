import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import Topbar from './topbar/Topbar';
import Sidebar from './sidebar/Sidebar';

class Layout extends PureComponent {
    render() {
        return (
            <div>
                <Topbar/>
                <Sidebar/>
            </div>
        )
    }
}

export default connect(state => {
    return {
        customizer: state.customizer
    }
})(Layout);