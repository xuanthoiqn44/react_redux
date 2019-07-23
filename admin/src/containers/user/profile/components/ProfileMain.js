import React, { PureComponent } from 'react';
import { Card, CardBody, Col, Button , ButtonToolbar } from 'reactstrap';
import { connect } from 'react-redux';
import {updateImageUser} from "../../../../redux/actions/userActions";
//const Ava = process.env.PUBLIC_URL + '/images/12.png';

class ProfileMain extends PureComponent {
    constructor(props){
        super(props);
        this.state = ({
            userName: this.props.user.userName,
            lastName: this.props.user.lastName,
            firstName: this.props.user.firstName,
            email: this.props.user.email,
            avatar : this.props.user.avatar,
            file: '',
            image: '',
            imageSizeVal: true,
            imageTypeVal: true
        })
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            userName: nextProps.user.userName,
            lastName: nextProps.user.lastName,
            firstName: nextProps.user.firstName,
            email: nextProps.user.email
        })
    }
    // componentWillUpdate(nextProps, nextState) {
    //     localStorage.setItem('_imageUserCache', nextState.image)
    // }
    onImageUpload = (e) => {
        debugger;
        let reader = new FileReader();
        let image = e.target.files[0];
        let imageSize = image.size / (1024 * 1024);
        if(image) {
            this.props.uploadImageUser(image);
            if( image.type === "image/jpeg"  ||  image.type === 'image/png' ) {
                reader.onloadend = () => {
                    this.setState({
                        file: image,
                        image: imageSize < 1 ? reader.result : null,
                        imageSizeVal: image.size / (1024 * 1024) < 1,
                        imageTypeVal: true
                    });
                };
                reader.readAsDataURL(image)
            }else {
                this.setState({
                    imageTypeVal: false
                })
            }
        }
    };
    render() {
        // let imageAsBase64='';
        // data:image/jpeg;base64, ${imageAsBase64}
        const {image,imageSizeVal, avatar, imageTypeVal} = this.state;
        let imageUserCache = localStorage.getItem('_imageUserCache');
        return (
            <Col md={12} lg={12} xl={12}>
                <Card>
                    <CardBody className='profile__card'>
                        <div className='profile__information'>
                            <div className='profile__avatar'>
                                <img src={image ? image : imageUserCache ? imageUserCache : `data:image/jpeg;base64, ${avatar ? avatar.data : ''}`} alt='avatar' />
                            </div>
                            <div className='profile__data'>
                                <p className='profile__name'>{this.state.userName}</p>
                                <p className='profile__work'>{`${this.state.firstName}  ${this.state.lastName}`} </p>
                                <p className='profile__contact'>{this.state.email}</p>
                                <ButtonToolbar className='form__button-toolbar'>
                                    <Button color='primary' type='submit'>
                                        Update avatar
                                        <input type='file' name='photo' id="upload-photo" onChange={(e) => this.onImageUpload(e)}/>
                                    </Button>
                                </ButtonToolbar>
                                <p className='profile__image__val'>{imageTypeVal ? imageSizeVal ? '' : 'Image size must smaller 1MB' : 'File upload must be JPG or PNG'}</p>
                                {/* <p className='profile__contact'>+23-123-743-23-21</p> */}
                                {/* <Button color='primary' className='icon profile__btn'><p><MessageTextOutlineIcon/> Message</p></Button> */}
                            </div>
                        </div>
                        <div className='profile__stats'>
                            <div className='profile__stat'>
                                <p className='profile__stat-number'>05</p>
                                <p className='profile__stat-title'>Projects</p>
                            </div>
                            <div className='profile__stat'>
                                <p className='profile__stat-number'>24</p>
                                <p className='profile__stat-title'>Tasks</p>
                            </div>
                            <div className='profile__stat'>
                                <p className='profile__stat-number'>12</p>
                                <p className='profile__stat-title'>Reports</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    uploadImageUser: (imageData) => {
        dispatch(updateImageUser(imageData))
    }
 });
 
 const mapStateToProps = (state) => ({
     imageData: state.users.imageUser,
 });

export default connect(mapStateToProps , mapDispatchToProps)(ProfileMain)