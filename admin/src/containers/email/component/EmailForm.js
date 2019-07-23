import React, {Component} from 'react'
import {Button, Card, CardBody} from "reactstrap";
import {Editor} from 'react-draft-wysiwyg';
import htmlToDraft from 'html-to-draftjs';
import {convertToRaw, EditorState, ContentState} from "draft-js";
import {connect} from "react-redux";
import draftToHtml from "draftjs-to-html";
import {emailActions} from "../../../redux/actions/emailActions";


const ToolbarOptions = {
    options: ['inline', 'blockType', 'list', 'textAlign', 'link', 'emoji', 'image', 'history'],
    inline: {
        options: ['bold', 'italic', 'underline']
    }
};
const mapDispatchToProps = (dispatch) => ({
    onNotificationSubmit: (data) => dispatch(emailActions.create(data)),
    onGetNotifications: () => dispatch(emailActions.get()),
    onUpdateNotification: (dataUpdate) => dispatch(emailActions.update(dataUpdate)),
    // onGetNotificationById: (id) => dispatch(notificationAction.getById(id))
    //onDeleteNotification: (id) => dispatch(deleteNotification(id)),
});
const mapStateToProps = (state) => ({
    notificationDetail: state.notify.notify
});

function FormError(props) {
    /* isHidden = true, return null*/
    if (props.isHidden) { return null;}

    return ( <div style={{ color: '#ff0000' }}>{props.errorMessage}</div>)
}
const validateInput = (type, checkingText) => {

    if (type === "Email") {
        const regexp = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;
        const checkingResult =regexp.exec(checkingText);
        // console.log('checkingResult', checkingResult);
        if(checkingResult !== null)
        {
            return {
                isInputValid: true,
                errorMessage: ''
            }
        }
        else
        {
            return {
                isInputValid: false,
                errorMessage: 'Email wrong.....' +
                    'Please! Enter your email agains.'
            }
        }
    }
};
class EmailForm extends Component {
    state = {
        isDisableUpdateButton: true,

    };
    constructor(props) {
        super(props);
        this.state = ( {
            Email: {
                value: '',
                isInputValid: true,
                errorMessage: ''
            },
        })
    }


    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.receiveData){
            const {receiveData: {notifyDetail:{_id,title , content, statusSent}}} = nextProps;
            const contentBlock = htmlToDraft(content);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.setState({
                    title,
                    editorState,
                    editMode: true,
                    statusSent,
                    _id,
                    isDisableUpdateButton: true
                })
            }
        }
        if(nextProps.addNewMode){
            this.setState({
                title: '',
                editorState: '',
                editMode: false
            })
        }
    }

    handleTitleOnChange = (e) => {
        // this.setState({
        //     isSubmitButtonDisabled: e.target.value === '',
        //     isUpdateButtonDisabled: e.target.value === '',
        // });
        this.setState({title: e.target.value , isDisableUpdateButton: false});
        const { name, value } = e.target;
        const newState = {...this.state[name]}; /* dummy object */
        newState.value = value;
        this.setState({[name]: newState});

    };
    onEditorStateChange = (editorState) => {
        // this.setState({
        //     isClearButtonDisabled: convertToRaw(editorState.getCurrentContent()).blocks[0].text === ''
        // });
        this.setState({
            editorState,
            isUpdateButtonDisabled: this.state.title === '',
            isDisableUpdateButton: false
        });

    };

    onHandleSubmitForm = (e) => {
        e.preventDefault();
        const {title, editorState} = this.state;
        const data = {
            title,
            content: editorState !== '' ? draftToHtml(convertToRaw(editorState.getCurrentContent())) : ''
        };
        this.props.onNotificationSubmit(data);
        this.props.onHandleAddNewButtonClick('true');
        this.props.onHandleAddNewButtonClick('success');
        this.props.onGetNotifications();
        this.setState({
            title: '',
            editorState: ''
        })
    };
    onHandleUpdateForm = (e) => {
        e.preventDefault();
        const {title , editorState , _id} = this.state;
        const dataUpdate = {
            title,
            content: draftToHtml(convertToRaw(editorState.getCurrentContent())),
            _id
        };
        console.log(dataUpdate);
        this.props.onUpdateNotification(dataUpdate);
        this.props.onHandleAddNewButtonClick('true');
        this.props.onHandleAddNewButtonClick('success');
        this.props.onGetNotifications();
    };

    onHandleClearForm = () => {
        this.setState({
            title: '',
            editorState: '',
            isSubmitButtonDisabled: true,
            isClearButtonDisabled: true,
        })
    };

    handleInputValidation = (e) => {
        const { name } = e.target;
        console.log('name', this.state[name].value);
        const { isInputValid, errorMessage } = validateInput(name, this.state[name].value);
        console.log('newState', errorMessage);
        const newState = {...this.state[name]}; /* dummy object */
        newState.isInputValid = isInputValid;
        newState.errorMessage = errorMessage;
        this.setState({[name]: newState});
    }

    render() {
        const {title, editorState, editMode, statusSent, isDisableUpdateButton} = this.state;

        return (
            <Card>
                <CardBody>
                    <div className='card_title_notification'>
                        <h5 className='bold-text'>Email Add Form</h5>
                    </div>
                    <div className="addNotification-form-container">
                        <form className='material-form'>

                            <label htmlFor="exampleInputEmail1">Email</label>
                            <input type="email" name="Email" required className="form-control"
                                    onBlur={this.handleInputValidation}
                                   value={title ? title : ''}
                                   onChange={this.handleTitleOnChange} placeholder= "Enter your email" />
                            <FormError
                                type="Email"
                                isHidden={this.state.Email.isInputValid}
                                errorMessage={this.state.Email.errorMessage} />

                            <p>Desctiption</p>
                            <div className='text-editor'>
                                <Editor
                                    editorState={editorState}
                                    wrapperClassName='demo-wrapper'
                                    editorClassName='demo-editor'
                                    onEditorStateChange={this.onEditorStateChange}
                                    toolbar={ToolbarOptions}
                                />
                            </div>
                        </form>
                        <div className="button-container">
                            {editMode
                                ?   <Button color='primary' type='submit' onClick={(e) => this.onHandleUpdateForm(e)}
                                        disabled={statusSent ? true : !!isDisableUpdateButton }>
                                        Update Email
                                    </Button>
                                :   <Button color='primary' type='submit' onClick={(e) => this.onHandleSubmitForm(e)}
                                        disabled={this.props.isSubmitButtonDisabled}>
                                        Add Email
                                    </Button>}
                            <Button color='primary' type='submit' onClick={(e) => this.onHandleClearForm(e)}
                                    disabled={editMode}>
                                    Clear Email
                            </Button>
                            {/*<Button style={{display: this.props.isDeleteButtonDisplay ? 'block' : 'none'}}*/}
                            {/*color='primary' type='submit'*/}
                            {/*onClick={(e) => this.onHandleDeleteNotification(e)}>Delete*/}
                            {/*Notice</Button>*/}
                        </div>
                    </div>
                </CardBody>
            </Card>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmailForm)
