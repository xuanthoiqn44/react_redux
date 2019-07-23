import React, { PureComponent } from 'react';
import { Button, ButtonToolbar } from 'reactstrap';
import { reduxForm } from 'redux-form';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import Alert from './../../../../components/Alert';
class ProfileSettings extends PureComponent {

    constructor(props, context) {
        super(props, context);
        this.state = {
            firstName: this.props.user.firstName,
            lastName: this.props.user.lastName,
            email: this.props.user.email,
            password: ''
        };
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
            password: ''
        })
    };

  componentWillReceiveProps(nextProps){
      this.setState({
          firstName: nextProps.user.firstName,
          lastName : nextProps.user.lastName,
          email: nextProps.user.email
      });
  }

    updateInfo = (e) => {
        const {imageData} = this.props;
        e.preventDefault();
    };

    render() {
        const {firstName , lastName , email } = this.state;
        const {imageData} = this.props;
        let imageVal = imageData ? imageData.size / (1024 * 1024) < 1 && (imageData.type === "image/jpeg"  ||  imageData.type === 'image/png') : false;
        return (
            <form className='material-form'>
                {this.props.alert.message &&
                    <Alert color={`${this.props.alert.type}`}>
                        <p>{this.props.alert.message}</p>
                    </Alert>
                }
                <TextField
                    className='material-form__field'
                    label={`First name`}
                    value={firstName ? firstName : ''}
                    onChange={this.handleChange('firstName')}
                />
                <TextField
                    className='material-form__field'
                    label={`Last name`}
                    value={lastName ? lastName : ''}
                    onChange={this.handleChange('lastName')}
                />

                <TextField
                    className='material-form__field'
                    label={`Email`}
                    value={email ? email : ''}
                    onChange={this.handleChange('email')}
                    disabled
                />

                {/*<TextField*/}
                    {/*className='material-form__field'*/}
                    {/*label={`Password`}*/}
                    {/*type='password'*/}
                    {/*value={password ? password : ''}*/}
                    {/*onChange={this.handleChange('password')}*/}
                {/*/>*/}

                <ButtonToolbar className='form__button-toolbar'>
                    <Button disabled={!imageVal} color='primary' type='submit' onClick={this.updateInfo}>Update profile</Button>
                    <Button type='button' onClick={this.clearInfo}>
                        Cancel
                    </Button>
                </ButtonToolbar>
            </form>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.authentication.user,
        alert: state.alert,
        imageData: state.users.imageUser
    }
};

const connectedProfileSettings = connect(mapStateToProps)(ProfileSettings);
export default reduxForm({
    form: 'profile_settings_form',
})(connectedProfileSettings);

