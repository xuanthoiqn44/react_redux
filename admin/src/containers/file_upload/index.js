import React, {PureComponent} from 'react';
import {Col, Container, Row} from 'reactstrap';
import showResults from './components/Show';
import FileUploadDefault from './components/FileUploadDefault';
import FileUploadCustomHeight from './components/FileUploadCustomHeight';
import {translate} from 'react-i18next';

class FileUpload extends PureComponent {
  render() {
    const {t} = this.props;

    return (
      <Container>
        <Row>
          <Col md={12}>
            <h3 className='page-title'>{t('forms.file_upload.title')}</h3>
            <h3 className='page-subhead subhead'>Use this elements, if you want to show some hints or additional
              information</h3>
          </Col>
        </Row>
        <Row>
          <FileUploadDefault onSubmit={showResults}/>
          <FileUploadCustomHeight onSubmit={showResults}/>
        </Row>
      </Container>
    )
  }
}

export default translate('common')(FileUpload);
