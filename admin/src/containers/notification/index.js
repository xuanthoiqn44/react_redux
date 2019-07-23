import React, {Component} from 'react'
import {Col, Container, Row} from "reactstrap";
import {connect} from "react-redux";
// import {
//     fetchNotification,
//     fetchNotifications
// } from "../../redux/actions/notifyActions";
import NotificationList from "./component/notificationList";
import NotificationForm from "./component/notificationForm";

const mapStateToProps = (state) => ({
    //notificationList: state.notification.notifications,

});
const mapDispatchToProps = (dispatch) => ({
    //onGetNotifications: () => dispatch(fetchNotifications()),
    //onGetNotificationById: (id) => dispatch(fetchNotification(id)),
});

class NotificationComponent extends Component {
    state = {toggle: false}

    componentWillMount() {
        //this.props.onGetNotifications();
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (this.state.trigger === true) {
            //nextProps.onGetNotifications();
        }
        // this.forceUpdate();
        // this.props.onGetNotifications();
        // console.log('nw', nextProps)
    }

    //handle selected notification


    onHandleAddNewButtonClick = ( mode) => {
        console.log('mode', mode)
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
    };


    onPushNotifyId = (pushData) => {
        if (pushData) {
            this.setState({pushData});
        }
    };

    render() {
        const {pushData, addNewMode} = this.state;
        return (
            <Container>
                <Row>
                    <Col md={4} lg={4}>
                        <NotificationForm receiveData={pushData}
                                          addNewMode={addNewMode}/>
                    </Col>
                    <Col md={8} lg={8}>
                        <NotificationList onPushNotifyId={this.onPushNotifyId}
                                          onHandleAddNewButtonClick={(mode) => this.onHandleAddNewButtonClick(mode)}/>

                    </Col>
                </Row>
            </Container>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationComponent)