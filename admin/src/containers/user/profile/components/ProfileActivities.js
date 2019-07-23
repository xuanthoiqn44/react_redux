import React, {PureComponent} from 'react';
import ProfileActivity from '../../../../components/ProfileActivity';

const Ava1 = process.env.PUBLIC_URL + '/images/12.png';
const Ava2 = process.env.PUBLIC_URL + '/images/15.png';
const Ava3 = process.env.PUBLIC_URL + '/images/11.png';
const Ava4 = process.env.PUBLIC_URL + '/images/photo_notification.png';
const Img1 = process.env.PUBLIC_URL + '/images/9.png';
const Img2 = process.env.PUBLIC_URL + '/images/13.png';

export default class ProfileActivities extends PureComponent {
    render() {
        return (
            <div>
                <ProfileActivity img={Ava1} date='1 min ago' name='Lora Kolly'>
                    <p>Dependent certainty off discovery him his tolerably offending. Ham for attention remainder sometimes
                        additions recommend fat our.</p>
                </ProfileActivity>
                <ProfileActivity img={Ava1} date='3 hours ago' name='Anna Bro'>
                    <p>Dependent certainty off discovery him his tolerably offending. Ham for attention remainder sometimes
                        additions recommend fat our. Dependent certainty off discovery him his tolerably offending. Ham for
                        attention remainder sometimes additions recommend fat our..</p>
                </ProfileActivity>
                <ProfileActivity img={Ava2} date='3 hours ago' name='Michel Tompson'>
                    <p>Dependent certainty off discovery him his <a href=''>tolerably</a> offending.</p>
                    <img src={Img1} alt=''/>
                    <img src={Img2} alt=''/>
                </ProfileActivity>
                <ProfileActivity img={Ava3} date='5 hours ago' name='Antony Mirrel '>
                    <p>Dependent certainty off discovery him his tolerably offending. Ham for attention remainder sometimes
                        additions recommend fat our.</p>
                </ProfileActivity>
                <ProfileActivity img={Ava4} date='20.05.2017' name='Lora Kolly'>
                    <p>Dependent certainty off discovery him his tolerably offending. Ham for attention remainder sometimes
                        additions recommend fat our. Dependent certainty off discovery him his tolerably offending. Ham for
                        attention remainder sometimes additions recommend fat our..</p>
                </ProfileActivity>
                <ProfileActivity img={Ava1} date='20.05.2017' name='Maria Anderson-Bella'>
                    <p>Dependent certainty off discovery him his tolerably offending. Ham for attention remainder sometimes
                        additions recommend fat our. Dependent certainty off discovery him his tolerably offending. Ham for
                        attention remainder sometimes additions recommend fat our..</p>
                </ProfileActivity>
            </div>
        )
    }
}