import React, {Component} from 'react';
import {Button, Card, CardBody, Col, Container, Row} from 'reactstrap';
import {connect} from 'react-redux';
import {userActions} from "../../../redux/actions/userActions";
import AccountBoxOutlineIcon from 'mdi-react/AccountBoxOutlineIcon';

import Alert from "../../../components/Alert";

function FormError(props) {
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
class userComponent extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            _id: this.props.user._id,
            userName: this.props.user.userName,
            lastName: this.props.user.lastName,
            firstName: this.props.user.firstName,
            email: this.props.user.email,
            avatar : this.props.user.avatar,
            file: '',
            imageSizeVal: true,
            imageTypeVal: true,
            Email: {
                value: '',
                isInputValid: true,
                errorMessage: ''
            }
        };
    }

    componentDidMount() {
        if(typeof this.props.user !== 'undefined') {
            this.setState({
                userName: this.props.user.userName,
                lastName: this.props.user.lastName,
                firstName: this.props.user.firstName,
                email: this.props.user.email,
                avatar : this.props.user.avatar
            });
        }
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    clearInfo = () => {
        this.setState({
            firstName: '',
            lastName: '',
            email: '',
            avatar: ''
        })
    };

    updateInfo = (e) => {
        e.preventDefault();
        const {_id, firstName , lastName , email, avatar, userName } = this.state;
        const data = { _id, firstName, lastName, email, avatar, userName};
        console.log(data);
        this.props.onUpdateProfile(data);
    };

    onImageUpload = (e) => {
        let reader = new FileReader();
        let avatar = e.target.files[0];
        if(avatar) {
            if( avatar.type === "image/jpeg"  ||  avatar.type === 'image/png' ) {
                reader.onloadend = () => {
                    this.setState({
                        file: avatar,
                        avatar: reader.result,
                        imageSizeVal: avatar.size / (1024 * 1024) < 1,
                        imageTypeVal: true
                    });
                };
                reader.readAsDataURL(avatar)
            }else {
                this.setState({
                    imageTypeVal: false
                })
            }
        }
    };
    handleEmailOnChange = (e) => {
        this.setState({email :e.target.value});
        const { name, value } = e.target;
        const newState = {...this.state[name]}; /* dummy object */
        newState.value = value;
        this.setState({[name]: newState});
    };
    handleInputValidation = (e) => {
        const { name } = e.target;
        const { isInputValid, errorMessage } = validateInput(name, this.state[name].value);
        const newState = {...this.state[name]}; /* dummy object */
        newState.isInputValid = isInputValid;
        newState.errorMessage = errorMessage;
        this.setState({[name]: newState});
    }

    render() {
        const { firstName , lastName, email , avatar, imageTypeVal, imageSizeVal } = this.state;
        const {alert} = this.props;
        return (
            <div className={"table"}>
                <Container>
                    <Card>
                        <CardBody>
                            <div>
                                {alert.message &&
                                <Alert color={`${alert.type}`}>
                                    <p>{alert.message}</p>
                                </Alert>
                                }
                                <Row className={"profile-div"}>
                                    <Col md={5} lg={5} xl={3} xs={12} className="d-flex justify-content-center profile">
                                        <Row>
                                            {/*<ProfileMain user={user}/>*/}
                                            <Col>
                                                <Card>
                                                    <div className='profile__card'>
                                                            <div className='profile__avatar'>
                                                                <img style={{width: 150, height: 150, marginBottom: 10, borderRadius: "50%",marginLeft: "auto", marginRight: "auto", display: "block"}}
                                                                     src={avatar ? avatar : process.env.PUBLIC_URL + '/images/avatar.jpg'}
                                                                     alt='avatar' />

                                                                    <div className="upload-btn-wrapper">

                                                                        <Button className="btnUploadFile" color="primary">
                                                                            <AccountBoxOutlineIcon/>
                                                                            Avatar
                                                                            <input className="upload-btn-wrapper"
                                                                                   type="file"
                                                                                   name="photo"
                                                                                   id="upload-photo"
                                                                                   accept="image/png, image/jpeg"
                                                                                   onChange={(e) => this.onImageUpload(e)}
                                                                            />
                                                                        </Button>
                                                                        <p className='profile__image__val'>{imageTypeVal ? imageSizeVal : 'Image size must smaller 1MB and must be JPG or PNG'}</p>
                                                                    </div>
                                                            </div>

                                                            <strong><label>User Name</label></strong>
                                                            <input type="text" className="form-control username"
                                                                   placeholder="Enter Your first name"
                                                                   value={firstName+ ' ' + lastName}
                                                                   disabled
                                                            />
                                                            <br />
                                                            <strong><label>Email</label></strong>
                                                            <input type="text" className="form-control username"
                                                                   placeholder="Enter Your first name"
                                                                   value={email}
                                                                   disabled
                                                            />

                                                    </div>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md={7} lg={7} xl={4} xs={12} className={"profile"}>
                                        <div>
                                            {/*<ProfileSettings />*/}
                                            <form className='material-form'>
                                                <h3 className="font-weight-bold">Edit Profile</h3>

                                                    <strong><label>First Name</label></strong>
                                                <input type="text" className="form-control FirstName"
                                                       id="FirstName"
                                                       placeholder="Enter Your first name"
                                                       value={firstName ? firstName : ''}
                                                       onChange={this.handleChange('firstName')}
                                                />

                                                <strong><label>Last Name</label></strong>
                                                <input type="text" className="form-control LastName"
                                                       id="LastName"
                                                       placeholder="Enter Your last name"
                                                       value={lastName ? lastName : ''}
                                                       onChange={this.handleChange('lastName')}
                                                />

                                                <strong><label>Email</label></strong>
                                                <input type="email" className="form-control Email"
                                                       id="Email"
                                                       placeholder="Enter Your Email"
                                                       value={email ? email : ''}
                                                       name="Email"
                                                       onBlur={this.handleInputValidation}
                                                       onChange={this.handleEmailOnChange}
                                                />
                                                <FormError
                                                    type="Email"
                                                    isHidden={this.state.Email.isInputValid}
                                                    errorMessage={this.state.Email.errorMessage} />



                                                <br/>
                                                <div className='Update-profile'>
                                                    <Button color='primary' type='submit' onClick={this.updateInfo}>
                                                        Update profile
                                                    </Button>
                                                    <Button type='button' onClick={this.clearInfo}>
                                                        Cancel
                                                    </Button>
                                                </div>

                                            </form>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </CardBody>
                    </Card>
                </Container>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { alert } = state;
    return {
        user : state.users.user,
        alert
    }
};

const mapDispatchToProps = (dispatch) => ({
    onUpdateProfile: (dataUpdate) => dispatch(userActions.update(dataUpdate))
});

export default connect(mapStateToProps,mapDispatchToProps)(userComponent);

