import React, { PureComponent } from 'react';
import DownIcon from 'mdi-react/ChevronDownIcon';
import TopbarMenuLink from './TopbarMenuLink';
import { Collapse } from 'reactstrap';
import { connect } from 'react-redux';

// const Ava = process.env.PUBLIC_URL + '/images/ava.png';

class TopbarProfile extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({ collapse: !this.state.collapse });
    }

    render() {
        return (
            <div className='topbar__profile'>
                <div className='topbar__avatar' onClick={this.toggle}>
                    <img className='topbar__avatar-img' src={this.props.user.avatar?this.props.user.avatar:process.env.PUBLIC_URL + '/images/avatar.jpg'} alt='avatar' />
                    <p className='topbar__avatar-name'>{this.props.user.firstName +' '+ this.props.user.lastName}</p>
                    <DownIcon className='topbar__icon' />
                </div>
                {this.state.collapse && <div className='topbar__back' onClick={this.toggle} />}
                <Collapse isOpen={this.state.collapse} className='topbar__menu-wrap'>
                    <div className='topbar__menu'>
                        <TopbarMenuLink title='Login' icon='user' path='/login' />
                        <TopbarMenuLink title='Profile' icon='file-add' path='/profile' />
                        <div className='topbar__menu-divider' />
                        <TopbarMenuLink title='Log Out' icon='exit' path='/login' />
                    </div>
                </Collapse>
            </div>
        )
    }
}


export default connect(state => {
    return { user: state.authentication.user }
})(TopbarProfile);
