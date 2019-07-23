import React, {Component} from 'react'
import {Col, Container} from "reactstrap";
import LanguageList from "../language/component/languageList";

class LanguageComponent extends Component {
    render() {
        return (
            <div className="table">
                <Container >
                    <Col md={12} lg={12} className='list mt-2'>
                        <LanguageList />
                    </Col>
                </Container>
            </div>
        )
    }
}

export default (LanguageComponent);
