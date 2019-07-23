import React, {Component, Fragment} from "react";

import {Column} from "primereact/column";
import {Button, Card, CardBody} from "reactstrap";
import {StyledDataTable} from "../../../components/TableNotify/dataTable_style";
import moment from "moment";
import {connect} from "react-redux";
import {notificationAction} from "../../../redux/actions/notifyActions";



const tableColumnStyle = {
    colID: {
        width: '5rem'
    },
    colTitle: {
        width: '20rem'
    }
};
const mapDispatchToProps = (dispatch) => ({
    onGetNotifications: () => dispatch(notificationAction.get()),
    onSendAdminNotification: (data) => dispatch(notificationAction.send(data))

});
const mapStateToProps = (state) => ({
    notifies: state.notify.notifies
});
class NotificationList extends Component {
    state = {
        trigger: 0
    };

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

    onStatusRender = (rowData, column) => {
        return (
            <Fragment>
                <div
                    className={rowData.statusSent === true ? "status-send" : "status-not-send"}>{rowData.statusSent === true ? 'SEND' : 'PENDING'}</div>
            </Fragment>
        )
    };
    onDateCreateRender = (rowData, column) => {
        const rowDataFormat = moment(rowData.createdDate).format('MM-DD-YYYY')
        return (
            <div>{rowDataFormat}</div>
        )
    };

    onActionRender = (rowData, column) => {
        return (
            <div className="action-container">
                <Button color='success' type='submit' onClick={(e) => this.onHandleSend(e, rowData)} disabled={rowData.statusSent === true}>Send</Button>
                {/*<Button color='danger' type='submit' onClick={(e) => this.onHandleEdit(e, rowData)}>Delete</Button>*/}
            </div>
        )
    };
    onHandleNoticeSelected = (data) => {
        this.setState({
            isDeleteButtonDisplay: true,
            isAddNewButtonDisabled: false,
            isUpdateButtonDisplay: true,
        });
        const pushData = {
            notifyDetail: data
        };
        this.props.onHandleAddNewButtonClick('addModeRemove')
        this.props.onPushNotifyId(pushData)
    };
    onHandleSend = (e, rowData) => {
        e.preventDefault();
        const {id} = rowData;
        this.props.onSendAdminNotification({id});
        this.props.onGetNotifications();
        //this.props.onSendNotificationFromAdmin(rowData.id);

    };

    render() {
        const {notifies} = this.state;
        return (
            <Card>
                <CardBody>
                    <div className='card_title_notification'>
                        <h5 className='bold-text'>Notification List</h5>
                        <Button color='primary' type='submit'
                                onClick={(e) => this.props.onHandleAddNewButtonClick( 'addMode')}
                                disabled={this.props.isAddNewButtonDisabled}>Add New
                            Notice</Button>
                    </div>
                    <StyledDataTable value={notifies} selectionMode="single"
                                     onSelectionChange={(data) => this.onHandleNoticeSelected(data.value)}
                                     paginator={true} rows={10} rowsPerPageOptions={[5, 10, 20]}>
                        <Column field="number" header="No." style={tableColumnStyle.colID} sortable={true}/>
                        <Column field="title" style={tableColumnStyle.colTitle} header="Title"
                                sortable={true}/>
                        <Column field="dateCreate" body={this.onDateCreateRender} header="Date Create" sortable={true}/>
                        <Column field="dateCreate"  header="Date Send" sortable={true}/>
                        <Column field="status" body={this.onStatusRender} header="Status" sortable={true}/>
                        <Column body={this.onActionRender} header="Action" sortable={true}/>
                    </StyledDataTable>
                </CardBody>
            </Card>
        )
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(NotificationList)