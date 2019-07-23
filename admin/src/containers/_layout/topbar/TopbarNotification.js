import React, {PureComponent} from 'react';
import {Collapse} from 'reactstrap';
import {Link} from 'react-router-dom';
import NotificationsIcon from 'mdi-react/NotificationsIcon';
import {notificationAction} from "../../../redux/actions/notifyActions";
import {connect} from "react-redux";
const mapDispatchToProps = (dispatch) => ({
    onGetNotifications: () => dispatch(notificationAction.get()),

});
const mapStateToProps = (state) => ({
    notifies: state.notify.notifies
});
// const notifications = [
//     {
//         ava: process.env.PUBLIC_URL + '/imagestopbar/ava.png',
//         name: 'Cristopher Changer', message: ' has started a new project', date: '09:02'
//     },
//     {
//         ava: process.env.PUBLIC_URL + '/imagestopbar/ava2.png',
//         name: 'Sveta Narry', message: ' has closed a project', date: '09:00'
//     },
//     {
//         ava: process.env.PUBLIC_URL + '/imagestopbar/ava3.png',
//         name: 'Lory McQueen', message: ' has started a new project as a Project Managert', date: '08:43'
//     },
//     {
//         ava: process.env.PUBLIC_URL + '/imagestopbar/ava2.png',
//         name: 'Cristopher Changer', message: ' has closed a project', date: '08:43'
//     }
// ];

class TopbarNotification extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            notifies:[]
        };
        this.toggle = this.toggle.bind(this);
    }
    componentWillMount() {
        this.props.onGetNotifications();
    }
    componentWillReceiveProps(nextProps, nextContext) {
        const {notifies} =  nextProps;

        let i = 1;
        if(notifies){
            notifies.map(notify => {notify.number = i++;return notify});
            this.setState({notifies})
        }
    }

    toggle() {
        this.setState({collapse: !this.state.collapse});
    }
    render() {
        const {notifies} = this.state;
        return (

            <div className='topbar__collapse'>
                <button className='topbar__btn topbar__btn--new' onClick={this.toggle}>
                    <NotificationsIcon/>
                    <div className='topbar__btn-new-label'>
                        <div/>
                    </div>
                </button>
                {this.state.collapse && <div className='topbar__back' onClick={this.toggle}/>}
                <Collapse
                    isOpen={this.state.collapse}
                    className='topbar__collapse-content'
                >
                    <div className='topbar__collapse-title-wrap'>
                        <p className='topbar__collapse-title'>Notifications</p>
                        <button className='topbar__collapse-button'>Mark all as read</button>
                    </div>
                    <div>
                        {notifies.map((notification, index) => {
                            if(index < 5) {
                                return(
                                    <a className='topbar__collapse-item' key={index} href="#/">
                                        <div className='topbar__collapse-img-wrap'>
                                            {notification.title}
                                        </div>
                                        <p className='topbar__collapse-message'>

                                            {notification.content}

                                        </p>
                                        <p className='topbar__collapse-date'>{notification.statusSent ? 'Send : '+ notification.statusSent : ''}</p>
                                    </a>
                                )
                            }
                            return null;
                        })}
                    </div>

                    <Link className='topbar__collapse-link' to='/notification'>
                        See all notifications
                    </Link>
                </Collapse>
            </div>
        )
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(TopbarNotification)
