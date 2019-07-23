import React, {PureComponent} from 'react';
import {Col, Container, Row} from 'reactstrap';
import DefaultModals from './components/DefaultModals';
import ColoredModals from './components/ColoredModals';
import HeaderModals from './components/HeaderModals';
import {translate} from 'react-i18next';

class Modals extends PureComponent {
    render() {
        const {t} = this.props;

        return (
            <Container>
                <Row>
                    <Col md={12}>
                        <h3 className='page-title'>{t('ui_elements.modals.title')}</h3>
                        <h3 className='page-subhead subhead'>Use this elements, if you want to show some hints or
                            additional
                            information</h3>
                    </Col>
                </Row>
                <Row>
                    <DefaultModals/>
                    <ColoredModals/>
                    <HeaderModals/>
                </Row>
            </Container>
        )
    }
}

export default translate('common')(Modals);
