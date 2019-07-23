import React, {Component} from 'react'
import {Button} from "reactstrap";
import {connect} from "react-redux";
import {categoryAction} from "../../../redux/actions/categoryActions";
import {productActions} from "../../../redux/actions/productActions";
import PlusBoxIcon from "mdi-react/PlusIcon";
import CloseBoxIcon from "mdi-react/CloseIcon";

class CategoryForm extends Component {
    constructor(props){
        super(props);
        this.state = ({
            title: '',
            userId: this.props.user._id,
            warning: '',
        });
    }

    handleTitleOnChange = (e) => {
        this.setState({title:e.target.value}) ;
    };
    onHandleSubmitForm = () => {
        const {userId,title} = this.state;
        const data = {
            userId,
            title,
        };
        if(!this.props.flag){
            this.props.onFlagChange(!this.props.flag);
        }
        if(data.title !== '') {
            this.props.onCategorySubmit(data);
            this.setState({
                title: '',
                warning: '',
            });
        } else {
            this.setState({
                warning: 'Title is blank!'
            });
        }
    };
    onHandleCloseForm = (state) => {
        this.setState({ title: '' });
        this.props.collapseTable(state);
    };
    render() {
        const {title, warning} = this.state;
        return (
            <div className={"category Addnew"}>
                <input type="text"
                       style={{ width: 300, display: "initial" }}
                       className="form-control"
                       placeholder="Add new category"
                       value={title ? title : ''}
                       onChange={this.handleTitleOnChange.bind(this)}/>
                <Button className='ml-1' color='primary' onClick={() => {this.onHandleSubmitForm()}}>
                    <PlusBoxIcon style={{pointerEvents: "none"}}/>
                </Button>
                <Button color='danger' onClick={() => this.onHandleCloseForm(this.props.collapseTab)}>
                    <CloseBoxIcon style={{pointerEvents: "none"}}/>
                </Button>
                {!title &&
                     <div className="help-block" style={{ color: '#ff0000' }}>{warning}</div>
                }
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    onCategorySubmit: (data) => dispatch(categoryAction.create(data)),
    collapseTable: (state) => dispatch(productActions.collapseTable(state)),
});

function mapStateToProps(state)
{
    const { product: {collapseTab}, users:{user} } = state;
    return {
        collapseTab,
        user,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryForm)
