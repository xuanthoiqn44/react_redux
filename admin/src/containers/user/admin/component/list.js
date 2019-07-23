import React, {Component} from "react";
import {Button, ButtonToolbar, Container, Modal} from "reactstrap";
import {connect} from "react-redux";
import {productActions} from "../../../../redux/actions/productActions";
import {userActions} from "../../../../redux/actions/userActions";
import ReactTable from "react-table";
import "react-table/react-table.css";
import Form from "./form";
import {Col, Row} from "reactstrap";
import EditIcon from 'mdi-react/EditIcon';
import BinIcon from 'mdi-react/BinIcon';
import {translate} from "react-i18next";

class List extends Component {
    state = {
        expanded: {},
        filtered: [],
        dataDetail: {},
        modal: false
    };

    componentDidMount() {
        this.props.getById({id: this.props.user._id});
    }

    getTdProps = (state, rowInfo, Cell) => {
        return {
            onClick: (e) => {
                if ((Cell.Header === 'Actions' || Cell.Header === undefined) && e.target.id !== 'btnDelete' && rowInfo !== undefined) {
                    const {expanded} = state;
                    const path = rowInfo.nestingPath[0];
                    const diff = {[path]: !expanded[path]};
                    rowInfo.row._original && this.setState({dataDetail: rowInfo.row._original});
                    this.setState({expanded: {...expanded, ...diff}});
                }
            },
            onChange: (e) => {
                if (Cell.Header === 'Status' && rowInfo.original._id) {
                    this.props.onUpdateStateProduct({id: rowInfo.original._id, value: e.target.value});
                }
            }
        };
    };
    onHandleDelete = (e, rowData) => {
        e.preventDefault();
        this.setState({expanded: {}});
        for (let value of this.props.listProd) {
            if (value._id === rowData.id) {
                for (let val of Object.values(value.title)) {
                    const data = {
                        id: rowData.id,
                        userId: this.props.user._id,
                        title: val.trim()
                    };
                    this.props.onDeleteProduction({data});
                }
            }
        }
        this.setState(prevState => ({modal: !prevState.modal}));
    };
    toggleModal = () => {
        this.setState({modal: !this.state.modal});
    };

    render() {
        return (
            <Container>
                {!this.props.newForm &&
                <div className='card_title_notification'>
                    <h5 className='bold-text'>User List</h5>
                    <Button color='primary' type='submit' onClick={this.props.toggleNewForm}
                            disabled={this.props.newForm}>
                        Add New User
                    </Button>
                </div>
                }
                <ReactTable
                    data={this.props.listUser}
                    filterable
                    filtered={this.state.filtered}
                    onFilteredChange={(filtered, columns, value) => {
                        let accessor = columns.id || columns.accessor;
                        let newFilter = true;
                        filtered.forEach((filter, i) => {
                            if (filter["id"] === accessor) {
                                if (value === "" || !value.length) filtered.splice(i, 1);
                                else filter["value"] = value;
                                newFilter = false;
                            }
                        });
                        newFilter && filtered.push({id: accessor, value: value});
                        this.setState({filtered: filtered});
                    }}
                    defaultFilterMethod={(filter, row, column) => {
                        const id = filter.pivotId || filter.id;
                        if (typeof filter.value === "object") {
                            return row[id] !== undefined
                                ? filter.value.indexOf(row[id]) > -1
                                : true;
                        } else {
                            return row[id] !== undefined
                                ? String(row[id]).indexOf(filter.value) > -1
                                : true;
                        }
                    }}
                    columns={[
                        {
                            columns: [
                                {
                                    expander: true,
                                    width: 0
                                },
                                {
                                    Header: 'User Name',
                                    accessor: "userName",
                                },
                                {
                                    Header: 'First Name',
                                    accessor: "firstName"
                                },
                                {
                                    Header: 'lastName',
                                    accessor: "lastName",
                                },
                                {
                                    Header: 'Role',
                                    accessor: "role",
                                },
                                {
                                    Header: 'Date Created',
                                    accessor: "createdDate",
                                },
                                {
                                    Header: 'Date Updated',
                                    accessor: "updatedDate",
                                },
                                {
                                    Header: 'Status',
                                    accessor: "status",
                                    filterable: true,
                                    Cell: (props) => {
                                        return (
                                            <div className="action-container" key={props.original._id}>
                                                <select className="browser-default custom-select"
                                                        defaultValue={props.original.status}>
                                                    <option value="Default">Default</option>
                                                    <option value="Pending">Pending</option>
                                                    <option value="Send">Send</option>
                                                </select>
                                            </div>
                                        );
                                    }
                                },
                                {
                                    Header: 'Actions',
                                    accessor: "",
                                    filterable: false,
                                    Cell: (props) => {
                                        return (
                                            <div className="action-container">
                                                <Button id='btnEdit'
                                                        color='success'
                                                        type='submit'>
                                                    <EditIcon style={{pointerEvents: "none"}}/>
                                                </Button>
                                                <Button id='btnDelete'
                                                        color='danger'
                                                        type='submit'
                                                        onClick={this.toggleModal}>
                                                    <BinIcon style={{pointerEvents: "none"}}/>
                                                </Button>
                                                <Modal isOpen={this.state.modal} toggle={this.toggleModal}
                                                       className='modal-dialog--primary'>
                                                    <div className='modal__header'>
                                                        <span className='lnr lnr-cross modal__close-btn'
                                                              onClick={this.toggleModal}/>
                                                        <h4 className='bold-text modal__title'>Delete Data</h4>
                                                    </div>
                                                    <div className='modal__body'>
                                                        Do you want to delete this data?
                                                    </div>
                                                    <ButtonToolbar className='modal__footer'>
                                                        <Button onClick={this.toggleModal}>Cancel</Button>
                                                        <Button color="primary"
                                                                onClick={(e) => this.onHandleDelete(e, props.row._original)}>Ok</Button>
                                                    </ButtonToolbar>
                                                </Modal>
                                            </div>
                                        );
                                    }
                                },
                            ]
                        }
                    ]}
                    defaultPageSize={10}
                    showPageSizeOptions={true}
                    className="-striped -highlight"
                    expanded={this.state.expanded}
                    getTdProps={this.getTdProps}
                    nextText={'Next'}
                    previousText={'Previous'}
                    SubComponent={row => {
                        return (
                            <Row className="d-flex justify-content-center pt-4 pb-4">
                                <Col md={11} lg={11} xs={11}>
                                    <Form dataDetail={this.state.dataDetail}
                                          onHandleCloseSub={(e) => {
                                              e && this.setState({expanded: {}})
                                          }}/>
                                </Col>
                            </Row>
                        )
                    }}
                />
            </Container>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    updateState: (state) => dispatch(productActions.updateState(state)),
    toggleNewProduct: (state) => dispatch(productActions.toggleNewProduct(state)),
    onUpdateStateProduct: (data) => dispatch(productActions.updateStateProduct(data)),
    getById: (userId) => dispatch(userActions.getById(userId)),
    onDeleteProduction: (data) => dispatch(productActions.delete(data))
});

function mapStateToProps(state) {
    const {product: {toggleState}, users: {user, listUser}} = state;
    return {
        toggleState,
        user,
        listUser
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('common')(List))
