import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Modal} from 'reactstrap';

export default class EventModalPage extends PureComponent {

    static propTypes = {
        title: PropTypes.string,
        color: PropTypes.string.isRequired,
        colored: PropTypes.bool,
        header: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        let Icon;

        switch (this.props.color) {
            case 'primary':
                Icon = <span className='lnr lnr-pushpin modal__title-icon'/>;
                break;
            case 'success':
                Icon = <span className='lnr lnr-thumbs-up modal__title-icon'/>;
                break;
            case 'warning':
                Icon = <span className='lnr lnr-flag modal__title-icon'/>;
                break;
            case 'danger':
                Icon = <span className='lnr lnr-cross-circle modal__title-icon'/>;
                break;
            default:
                break;
        }

        return (
            <React.Fragment>
                <a className={this.props.linkClass} onClick={this.toggle} href="#">{this.props.linkBody}</a>
                <Modal isOpen={this.state.modal} toggle={this.toggle} backdrop="static"
                       className={`modal-dialog-header--customize`}>
                    <div className='modal__body'>
                        <span className='lnr lnr-cross modal__close-btn' onClick={this.toggle}/>
                        {this.props.body}
                    </div>
                </Modal>
            </React.Fragment>
        );
    }
}