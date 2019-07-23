import React, {Component} from 'react'
import {Col} from "reactstrap";
import {connect} from "react-redux";
import List from "./component/list";
import Form from "./component/form";

class FormList extends Component {
    state = {
        newForm: false
    };

    toggleNewForm = () => {
        this.setState({newForm: !this.state.newForm});
    };

    render() {
        return (
            <div className="table">
                <div className="container-area">
                    <Col md={12} lg={12} className={this.state.newForm ? 'Form' : 'hiddenAdd'}>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Add User</legend>
                            <Form toggleNewForm={this.toggleNewForm} newForm={this.state.newForm}/>
                        </fieldset>
                    </Col>
                    <Col md={12} lg={12}>
                        <List toggleNewForm={this.toggleNewForm} newForm={this.state.newForm}/>
                    </Col>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const {product: {toggleState}} = state;
    return {
        toggleState,
    };
}

const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(FormList)
