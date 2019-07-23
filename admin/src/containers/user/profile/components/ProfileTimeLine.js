import React, {PureComponent} from 'react';
import TimeLineItem from '../../../../components/TimeLineItem';

const Ava1 = process.env.PUBLIC_URL + '/images/14.png';
const Ava2 = process.env.PUBLIC_URL + '/images/15.png';

export default class TimelineHistory extends PureComponent {
    render() {
        return (
            <div className='timeline'>
                <TimeLineItem type='work' title='Business meetup' date='3 hours ago'>
                    <p>Dependent certainty off discovery him his tolerably offending. Ham for attention remainder
                        sometimes additions recommend fat our.</p>
                </TimeLineItem>
                <TimeLineItem type='video' title='Video conference with client' date='5 hours ago'>
                    <p>Dependent certainty off discovery him his tolerably offending. Ham for attention remainder
                        sometimes additions recommend fat our.</p>
                </TimeLineItem>
                <TimeLineItem img={Ava1} title='Call to Jovanna' date='8 hours ago'>
                    <p>Dependent certainty off discovery him his tolerably offending. Ham for attention remainder
                        sometimes additions recommend fat our.</p>
                </TimeLineItem>
                <TimeLineItem type='file' title='Create offer. Prepare document' date='Yesterday at 18:30'>
                    <p>Dependent certainty off discovery him his tolerably offending. Ham for attention remainder
                        sometimes additions recommend fat our.</p>
                </TimeLineItem>
                <TimeLineItem img={Ava2} title='Conversation with Philip' date='21.03.2017'>
                    <p>Dependent certainty off discovery him his tolerably offending. Ham for attention remainder
                        sometimes additions recommend fat our.</p>
                </TimeLineItem>
            </div>
        )
    }
}