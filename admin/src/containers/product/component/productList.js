import React, {Component} from "react";
import {Button,Container} from "reactstrap";
import {connect} from "react-redux";
import {productActions} from "../../../redux/actions/productActions";
import ReactTable from "react-table";
import "react-table/react-table.css";
import ProductForm from "./productForm";
import {Col, Row} from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import EditIcon from 'mdi-react/EditIcon';
import BinIcon from 'mdi-react/BinIcon';
import {categoryAction} from "../../../redux/actions/categoryActions";
import {translate} from "react-i18next";

class ProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pushData: '',
            expanded: {},
            modal: false,
            idProduct: null,
            images: [],
            userId: this.props.user._id,
            filtered: [],
            categories: [],
        };
    };

    componentWillMount() {
        (async () => {
            await new Promise((resolve) => {
                this.props.onGetByUserId(this.state.userId);
                resolve(true);
            })
        })();
        this.props.getCategory(this.state.userId);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {categories} = nextProps;
        if(categories){
            this.setState({
                categories
            })
        }
    }
    onListImageRender = (rowData) => {
        if (rowData.path.length > 0) {
            return (
                <div>
                    <img src={rowData.path[0]} className='imagesList' alt='Images'/>
                </div>
            )
        }
    };
    onListCategories = (rowData) => {
        let temp = [];
        for ( let val of rowData.categoryId ) {
            for ( let elem of this.state.categories ) {
                if(val === elem.id) {
                    temp = temp.concat(elem.title)
                }
            }
        }
        return (
            <div> {temp.join(",")} </div>
        )
    };
    getTdProps = (state, rowInfo, Cell) => {
        return {
            onClick: (e) => {
                if ( Cell.Header ===  this.props.t('nameLanguage.actions')|| Cell.Header === undefined ) {
                    if ( e.target.id !== 'btnDelete' && rowInfo !== undefined ){
                        const { expanded } = state;
                        const path = rowInfo.nestingPath[0];
                        const diff = { [path]: !expanded[path] };
                        this.onHandleNoticeSelected(rowInfo.row._original);
                        this.setState({
                            expanded: {
                                ...expanded,
                                ...diff
                            }
                        });
                    }
                }
            },
            onChange: (e) => {
                if(Cell.Header=== this.props.t('nameLanguage.status'))
                {
                    if(rowInfo.original._id) {
                        this.onHandleSetState({id: rowInfo.original._id, value: e.target.value});
                    }
                }
            }
        };
    };
    onHandleNoticeSelected = (data) => {
        const pushData = {
            detail: data
        };
        if(pushData) {
            this.setState({pushData : pushData});
        }
    };
    onHandleDelete = (e, rowData) => {
        e.preventDefault();
        this.setState({
            expanded:true
        });
        for ( let value of this.props.products) {
            if(value._id === rowData) {
                for (let val of Object.values(value.title)) {
                    const data = {
                        id : rowData,
                        userId : this.state.userId,
                        title: val.trim()
                    };
                    this.props.onDeleteProduction({data});
                }
            }
        }
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    };
    toggleButtonDelete = (rowData) => {
        this.setState(prevState => ({
            modal: !prevState.modal,
            idProduct: rowData.id,
        }));
    };
    onHandleSetState = (data) =>{
        this.props.onUpdateStateProduct(data);
    };
    onHandleAddNewForm = (state) => {
        this.props.toggleNewProduct(state);
    };
    onHandleCloseSub = (e) => {
        if(e === 'true') {
            this.setState({
                expanded : true
            })
        }
    };
    onFilteredChangeCustom = (value, accessor) => {
        let filtered = this.state.filtered;
        let insertNewFilter = 1;

        if (filtered.length) {
            filtered.forEach((filter, i) => {
                if (filter["id"] === accessor) {
                    if (value === "" || !value.length) filtered.splice(i, 1);
                    else filter["value"] = value;
                    insertNewFilter = 0;
                }
            });
        }

        if (insertNewFilter) {
            filtered.push({ id: accessor, value: value });
        }

        this.setState({ filtered: filtered });
    };

    render() {
        const {addNewMode} = this.state;
        const {t,stateLanguage} = this.props;

        return (
            <Container>
                {!this.props.toggleState &&
                <div className='card_title_notification'>
                    <h5 className='bold-text'>{t('nameLanguage.productList')}</h5>
                    <Button color='primary' type='submit'
                            onClick={()=>this.onHandleAddNewForm(this.props.toggleState)}
                            disabled={this.props.isAddNewButtonDisabled}>
                        {t('nameLanguage.addNewProduct')}
                    </Button>
                </div>
                }
                <div>
                    <ReactTable
                        data = {this.props.products}
                        filterable
                        filtered={this.state.filtered}
                        onFilteredChange={(filtered, columns, value) => {
                            this.onFilteredChangeCustom(value, columns.id || columns.accessor);
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
                        columns = {[
                            {
                                Header: t('nameLanguage.productHeader'),
                                columns: [
                                    {
                                        expander: true,
                                        width: 0
                                    },
                                    {
                                        Header:  t('nameLanguage.product'),
                                        accessor: "title." + (stateLanguage === ('en' || 'us') ? 'us' : stateLanguage)
                                    },
                                    {
                                        Header: t('nameLanguage.price'),
                                        accessor: "price",
                                    },
                                    {
                                        Header: t('nameLanguage.sale'),
                                        accessor: "sale",
                                    },
                                    {
                                        Header:  t('nameLanguage.image'),
                                        filterable: false,
                                        Cell: props => {
                                            return (
                                                <div className= "action-container">
                                                    {this.onListImageRender(props.row._original)}
                                                </div>
                                            );
                                        }
                                    },
                                    {
                                        Header:  t('nameLanguage.category'),
                                        filterable: false,
                                        Cell: props => {
                                            return (
                                                <div className= "action-container">
                                                    {this.onListCategories(props.row._original)}
                                                </div>
                                            );
                                        }
                                    },
                                    {
                                        Header:  t('nameLanguage.dateCreate'),
                                        accessor: "createdDate",
                                    },
                                    {
                                        Header:  t('nameLanguage.status'),
                                        accessor: "status",
                                        filterable: false,
                                        Cell: (props)  => {
                                            return (
                                                <div className= "action-container" key={props.original._id}>
                                                    <select id='language' className="browser-default custom-select"
                                                            defaultValue={props.original.status}
                                                    >
                                                        <option value="Default" >Default</option>
                                                        <option value="Pending" >Pending</option>
                                                        <option value="Send" >Send</option>
                                                    </select>
                                                </div>
                                            );
                                        }
                                    },
                                    {
                                        Header:  t('nameLanguage.actions'),
                                        accessor: "",
                                        filterable: false,
                                        Cell: (props) => {
                                            return (
                                                <div className= "action-container">
                                                    <Button id='btnEdit'
                                                            color='success'
                                                            type='submit' >
                                                        <EditIcon style={{pointerEvents: "none"}}/>
                                                    </Button>
                                                    <Button id='btnDelete'
                                                            color='danger'
                                                            type='submit'
                                                            onClick={ () => this.toggleButtonDelete(props.row._original) } >
                                                        <BinIcon style={{pointerEvents: "none"}}/>
                                                    </Button>
                                                    <Modal isOpen={this.state.modal} className={this.props.className}>
                                                        <ModalHeader toggle={this.toggleButtonDelete}>Delete product</ModalHeader>
                                                        <ModalBody>
                                                            Do you want to delete this product?
                                                        </ModalBody>
                                                        <ModalFooter>
                                                            <Button color="primary"  onClick={(e) => this.onHandleDelete(e, this.state.idProduct)}>Delete</Button>{' '}
                                                            <Button color="secondary" onClick={() => this.toggleButtonDelete('')}>Cancel</Button>
                                                        </ModalFooter>
                                                    </Modal>
                                                </div>
                                            );
                                        }
                                    },
                                ]
                            }
                        ]}
                        defaultPageSize = {10}
                        // showPageSizeOptions={false}
                        className = "-striped -highlight"
                        expanded={this.state.expanded}
                        getTdProps = {this.getTdProps}
                        nextText = { t('nameLanguage.next')}
                        previousText = { t('nameLanguage.previous')}
                        SubComponent = {row => {
                            return (
                                <div>
                                    <Row className="d-flex justify-content-center pt-4 pb-4" >
                                        <Col md={11} lg={11} xs={11}>
                                            <ProductForm receiveData={this.state.pushData} addNewMode={addNewMode}
                                                         onHandleCloseSub = {(e) => this.onHandleCloseSub(e)}/>
                                        </Col>
                                    </Row>
                                </div>
                            )
                        }}
                    />
                </div>
            </Container>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    updateState: (state) => dispatch(productActions.updateState(state)),
    toggleNewProduct: (state) => dispatch(productActions.toggleNewProduct(state)),
    onUpdateStateProduct: (data) => dispatch(productActions.updateStateProduct(data)),
    onGetByUserId: (userId) => dispatch(productActions.getByUserId(userId)),
    onDeleteProduction: (data) => dispatch(productActions.delete(data)),
    getCategory: (userId) => dispatch(categoryAction.get(userId)),
});

function mapStateToProps(state)
{
    const { product: {products, toggleState}, users: {user}, category: {categories}, language:{stateLanguage},t } = state;
    return {
        products,
        toggleState,
        user,
        t,
        categories,
        stateLanguage
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(translate('common')(ProductList))
