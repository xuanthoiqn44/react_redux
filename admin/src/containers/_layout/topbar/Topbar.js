import React, {PureComponent} from 'react';
import {Link} from 'react-router-dom';
import TopbarSidebarButton from './TopbarSidebarButton';
import TopbarProfile from './TopbarProfile';
import TopbarNotification from "./TopbarNotification";

export default class Topbar extends PureComponent {
    render() {
        return (
            <div className='topbar'>
                <div className='topbar__wrapper'>
                    <TopbarSidebarButton/>
                    <Link className='topbar__logo' to='/'> PP <span>System </span></Link>
                    <div className='topbar__right'>
                        <TopbarNotification/>
                        <TopbarProfile/>
                    </div>
                </div>
            </div>
        )
    }
}
