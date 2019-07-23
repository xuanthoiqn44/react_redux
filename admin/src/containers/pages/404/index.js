import React, {PureComponent} from 'react';
import {Link} from 'react-router-dom'
import Image404 from '../../../images/404/404.jpg';

export default class NotFound404 extends PureComponent {
    render() {
        return (
            <div className='not-found'>
                <div className='not-found__content fadeIn'>
                    <img className='not-found__image' src={Image404} alt='404'/>
                    <div className='not-found__info'>Ooops! A The page you are looking for could not be found :(</div>
                    <Link className='back-to-login' to='/login'>Back to Login</Link>
                </div>
            </div>
        )
    }
}