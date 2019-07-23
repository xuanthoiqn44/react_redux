import React, {Component} from 'react'
import {Col} from "reactstrap";
import {connect} from "react-redux";
// import {
//     fetchNotification,
//     fetchNotifications
// } from "../../redux/actions/notifyActions";
import EmailList from "./component/EmailList";
import EmailForm from "./component/EmailForm";
import './email.css';

class EmailComponent extends Component {
    state = {
        toggle: false,
        showAdd: false,
        showAddUnder: false,
    }

    componentWillMount() {
        //this.props.onGetNotifications();
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (this.state.trigger === true) {
            //nextProps.onGetNotifications();
        }
    }

    onHandleAddNewButtonClick = ( mode) => {
        // console.log('mode', mode)
        this.setState({
            isAddNewButtonDisabled: true,
            isDeleteButtonDisplay: false,
            isUpdateButtonDisplay: false,
        });
        if(mode === 'addMode'){
            this.setState({
                addNewMode: true
            })
        }
        if(mode === 'addModeRemove'){
            this.setState({
                addNewMode: false
            })
        }
        if(mode==='true') {
            this.setState({
                showAdd: !this.state.showAdd
            })
        }
        if(mode==='addMode') {
            this.setState({
                showAdd: !this.state.showAdd
            })
        }
        if(mode==='editEmail') {
            this.setState({
                showAddUnder: !this.state.showAddUnder
            })
        }
        if(mode==='success') {
            this.setState({
                showAddUnder: !this.state.showAddUnder
            })
        }
    };
    onPushNotifyId = (pushData) => {
        if (pushData) {
            this.setState({pushData});
        }
    };

    render() {
        const {pushData, addNewMode} = this.state;
        //const {notificationList} = this.props;
        return (
                <div className={"table"}>
                    <div className={"container-area"}>
                        <div className={this.state.showAdd?'':'hiddenAdd'} >
                            <Col md={12} lg={12}>
                                <EmailForm receiveData={pushData}
                                 onHandleAddNewButtonClick = {
                                    (mode) => this.onHandleAddNewButtonClick(mode)
                                }
                                addNewMode={addNewMode}/>
                            </Col>
                        </div>
                        <div>
                            <Col md={12} lg={12}>
                                <EmailList
                                onPushNotifyId={this.onPushNotifyId}
                                onHandleAddNewButtonClick = {
                                    (mode) => this.onHandleAddNewButtonClick(mode)
                                }
                                />

                            </Col>
                        </div>
                    </div>
                </div>
        )
    }
}

const mapStateToProps = (state) => ({
    //notificationList: state.notification.notifications,

});
const mapDispatchToProps = (dispatch) => ({
    //onGetNotifications: () => dispatch(fetchNotifications()),
    //onGetNotificationById: (id) => dispatch(fetchNotification(id)),
});
export default connect(mapStateToProps, mapDispatchToProps)(EmailComponent)
