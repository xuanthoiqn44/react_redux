import React, {Component} from 'react'
import {Button, Card, CardBody} from "reactstrap";
import TextField from "@material-ui/core/TextField/TextField";
import {Editor} from 'react-draft-wysiwyg';
import htmlToDraft from 'html-to-draftjs';
import {convertToRaw, EditorState, ContentState} from "draft-js";
import {connect} from "react-redux";
import draftToHtml from "draftjs-to-html";
import {notificationAction} from "../../../redux/actions/notifyActions";


const ToolbarOptions = {
    options: ['inline', 'blockType', 'list', 'textAlign', 'link', 'emoji', 'image', 'history'],
    inline: {
        options: ['bold', 'italic', 'underline']
    }
};
const mapDispatchToProps = (dispatch) => ({
    onNotificationSubmit: (data) => dispatch(notificationAction.create(data)),
    onGetNotifications: () => dispatch(notificationAction.get()),
    onUpdateNotification: (dataUpdate) => dispatch(notificationAction.update(dataUpdate)),
    //onDeleteNotification: (id) => dispatch(deleteNotification(id)),
});
const mapStateToProps = (state) => ({
    notificationDetail: state.notify.notify
});

class NotificationForm extends Component {
    state = {
        isDisableUpdateButton: true
    };

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
        this.setState({title: e.target.value , isDisableUpdateButton: false})
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
        this.props.onGetNotifications();
    };
    // onHandleDeleteNotification = (idFormList) => {
    //     const {notificationDetail: {id}} = this.props;
    //     this.props.onDeleteNotification(id);
    //     console.log('props', this.props.notificationDetail)
    //     // this.props.onDeleteNotification(id ? id : idFormList);
    //     this.onHandleClearForm();
    //     this.triggerFetchData();
    //     // this.onHandleAddNewButtonClick();
    // };

    onHandleClearForm = () => {
        this.setState({
            title: '',
            editorState: '',
            isSubmitButtonDisabled: true,
            isClearButtonDisabled: true,
        })
    };

    render() {
        const {title, editorState, editMode, statusSent, isDisableUpdateButton} = this.state;

        return (
            <Card>
                <CardBody>
                    <div className='card_title_notification'>
                        <h5 className='bold-text'>Notification Add Form</h5>
                    </div>
                    <div className="addNotification-form-container">
                        <form className='material-form'>
                            <TextField required className='material-form__field' label={`Title`} id='title'
                                       value={title ? title : ''}
                                       onChange={this.handleTitleOnChange}/>
                            <p>Content</p>
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
                                ? <Button color='primary' type='submit' onClick={(e) => this.onHandleUpdateForm(e)}
                                        disabled={statusSent ? true : !!isDisableUpdateButton }>Update Notice</Button>
                                : <Button color='primary' type='submit' onClick={(e) => this.onHandleSubmitForm(e)}
                                        disabled={this.props.isSubmitButtonDisabled}>Add Notice</Button>}
                            <Button color='primary' type='submit' onClick={(e) => this.onHandleClearForm(e)}
                                    disabled={editMode}>Clear
                                Notice</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(NotificationForm)
