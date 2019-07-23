import React, {PureComponent} from 'react';
import {changeSidebarVisibility, changeMobileSidebarVisibility} from '../../../redux/actions/sidebarActions';
import {connect} from 'react-redux';

class TopbarSidebarButton extends PureComponent {

    changeSidebarVisibility = () => {
        this.props.dispatch(changeSidebarVisibility());
    };

    changeMobileSidebarVisibility = () => {
        this.props.dispatch(changeMobileSidebarVisibility());
    };

    render() {
        return (
            <div>
                <button className='topbar__button topbar__button--desktop' onClick={this.changeSidebarVisibility}>
                    <span className="lnr lnr-text-align-justify"/>
                </button>
                <button className='topbar__button topbar__button--mobile' onClick={this.changeMobileSidebarVisibility}>
                    <span className="lnr lnr-text-align-justify"/>
                </button>
            </div>
        )
    }
}

export default connect(state => {
    return {sidebar: state.sidebar};
})(TopbarSidebarButton);
