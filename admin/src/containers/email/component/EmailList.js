import React, {Component} from "react";
import {Button, Card} from "reactstrap";
import {connect} from "react-redux";
import {emailActions} from "../../../redux/actions/emailActions";
import matchSorter from 'match-sorter'
import ReactTable from "react-table";
import "react-table/react-table.css";
import EmailEditForm from "./EmailEditForm";
import {Col, Row, Modal, ModalHeader, ModalBody, ModalFooter} from "reactstrap";

const mapDispatchToProps = (dispatch) => ({
    onGetNotifications: () => dispatch(emailActions.get()),
    onSendAdminNotification: (data) => dispatch(emailActions.send(data)),
    onDeleteNotification: (param) => dispatch(emailActions.delete(param)),

});

const mapStateToProps = (state) => ({
    notifies: state.notify.notifies
});
class EmailList extends Component {
    state = {
        trigger: 0,
        pushData: '',
        expanded: {},
    };
    constructor(props) {
        super(props);
        this.state = {
            modal: false
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
    onHandleNoticeSelected = (data) => {
        this.setState({
            isDeleteButtonDisplay: true,
            isAddNewButtonDisabled: false,
            isUpdateButtonDisplay: false,
        });
        const pushData = {
            notifyDetail: data
        };
        if(pushData) {
          this.setState({pushData : pushData});
        }
        console.log('pushdata : ', pushData);
    };

    onHandleDelete = (e, rowData) => {
        e.preventDefault();
        this.props.onDeleteNotification({id: rowData});
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    };
    getTrProps = (state, rowInfo, Cell) => {
        return {
            onClick: (e) => {
                if ( Cell.Header === 'Edit Email' || Cell.Header === undefined ) {
                    if ( e.target.id !== 'btnDelete' ) {
                        const { expanded } = state;
                        const path = rowInfo.nestingPath[0];
                        const diff = { [path]: expanded[path] ? false : true };
                        this.onHandleNoticeSelected(rowInfo.row._original);
                        this.setState({
                            expanded: {
                                ...expanded,
                                ...diff
                            }
                        });
                    }
                }
            }
        };
    };
    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    };
    render() {
        const {notifies} = this.state;
        const {addNewMode} = this.state;
        return (
            <Card>

                    <div className='card_title_notification'>
                        <h5 className='bold-text'>Email List</h5>
                        <Button color='primary' type='submit'
                                onClick={(e) => this.props.onHandleAddNewButtonClick( 'addMode')}
                                disabled={this.props.isAddNewButtonDisabled}>Add New
                            Email</Button>
                    </div>
                    <div>
                        <ReactTable
                            data = {notifies}
                            filterable
                            defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "List Emails",
                                  columns: [
                                    {
                                      Header: "No.",
                                      accessor: "number",
                                       maxWidth : 100,
                                      filterMethod: (filter, rows) =>
                                      matchSorter(rows, filter.value, { keys: ["number"] }),
                                      filterAll: true
                                    },
                                    {
                                      Header: "Email",
                                      accessor: "title",
                                      filterMethod: (filter, rows) =>
                                      matchSorter(rows, filter.value, { keys: ["title"] }),
                                      filterAll: true
                                    },
                                    {
                                      Header: "Date Create",
                                      accessor: "createdDate",
                                      filterMethod: (filter, rows) =>
                                      matchSorter(rows, filter.value, { keys: ["createdDate"] }),
                                      filterAll: true
                                    },
                                    {
                                        Header: "Edit Email",
                                        accessor: "",
                                        filterable: false,
                                        Cell: props => {
                                          return (
                                            <div className= "action-container">
                                                <Button color='success' type='submit' onClick={() => this.onHandleNoticeSelected(props.row._original)}>Edit Email</Button> <br />


                                          </div>

                                          );
                                        }
                                    },

                                    {
                                        Header: "Delete",
                                        accessor: 'status',
                                         id: "row",
                                         filterable: false,
                                        // Cell: (props) => {
                                        //   return (
                                        // {/*      <div className= "action-container">*/}
                                        // {/*        <Button color='danger' type='submit'  onClick={(e) => this.onHandleDelete(e, props.row._original.id)}>Delete</Button>*/}
                                        // {/*</div>*/}

                                        // )
                                        // }
                                        Cell: (props) => {
                                            return (

                                            <div>
                                                <Button color="danger" onClick={this.toggle}>Delete Email</Button>
                                                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                                                    <ModalHeader toggle={this.toggle}>Notification Delete Email</ModalHeader>
                                                    <ModalBody>
                                                        Do you want to delete this email ?
                                                    </ModalBody>
                                                    <ModalFooter>
                                                        <Button color="primary" onClick={(e) => this.onHandleDelete(e, props.row._original.id)}>Delete</Button>{' '}
                                                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                                                    </ModalFooter>
                                                </Modal>
                                            </div>
                                        )
                                        }
                                    }
                                  ]
                                },
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "Filter",
                                      accessor: "number",
                                      id: "over",
                                      Cell: ({ value }) => (value >= 21 ? "Yes" : "No"),
                                      filterMethod: (filter, row) => {
                                        if (filter.value === "all") {
                                          return true;
                                        }
                                        if (filter.value === "true") {
                                          return row[filter.id] >= 11;
                                        }
                                        return row[filter.id] < 21;
                                      },
                                      Filter: ({ filter, onChange }) =>
                                        <select
                                          onChange={event => onChange(event.target.value)}
                                          style={{ width: "100%" }}
                                          value={filter ? filter.value : "all"}
                                        >
                                          <option value="all">Show All</option>
                                          <option value="true">ESC</option>
                                          <option value="false">DESC</option>
                                        </select>
                                    }
                                  ]
                                }
                              ]}
                            defaultPageSize = {10}
                            className = "-striped -highlight"
                            expanded={this.state.expanded}
                            getTdProps = {this.getTrProps}
                              SubComponent={row => {
                                return (
                                  <div>
                                       <Row className="d-flex justify-content-center" >
                                          <Col md={8} lg={8}>
                                              <EmailEditForm receiveData={this.state.pushData}
                                              addNewMode={addNewMode}/>
                                          </Col>
                                      </Row>
                                  </div>
                                )
                              }}
                            />
                        <br />

                    </div>

            </Card>
        )
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(EmailList)
