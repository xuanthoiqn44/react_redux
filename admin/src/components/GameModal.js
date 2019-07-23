import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'reactstrap';
export default class GameModalComponent extends PureComponent {

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
            <div>
                <a className={this.props.linkClass} onClick={this.toggle} href="#/">{this.props.linkBody}</a>

                <Modal isOpen={this.state.modal} toggle={this.toggle} backdrop="static"
                       className={`modal-dialog--${this.props.color} ${this.props.colored ? 'modal-dialog--colored' : ''} ${this.props.header ? 'modal-dialog--header' : ''}`}>
                    <div className='modal__header'>
                        <span className='lnr lnr-cross modal__close-btn' onClick={this.toggle}/>
                        {this.props.header ? '' : Icon}
                        <h4 className='bold-text  modal__title'>{this.props.title}</h4>
                    </div>
                    <div className='modal__body'>
                        {this.props.body}
                    </div>
                </Modal>
            </div>
        );
    }
}