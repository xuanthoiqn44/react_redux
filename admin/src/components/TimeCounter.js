import React, { PureComponent } from 'react';
import connect from "react-redux/es/connect/connect";

var setTime = 30;
class TimeCounter extends PureComponent {
    constructor(props) {
        super(props);
        let fixDate = '';
        // if(new Date().getMinutes()<20)
        //     fixDate = (new Date()).setMinutes(20,0);
        // else if(new Date().getMinutes()<40)
        //     fixDate = (new Date()).setMinutes(40,0);
        // else if(new Date().getMinutes()<60)
        //     fixDate = (new Date()).setMinutes(60,0);

        fixDate = (new Date()).setMinutes(setTime,0);

        let currDate = new Date();
        this.state = { fixDate, diff: fixDate-currDate };

    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState((prevState, props) => ({
            diff: prevState.fixDate - (new Date()).getTime(),
        }));
        if(this.state.diff<0)
        {
            let fixDate = '';
            // if(new Date().getMinutes()<20)
            //     fixDate = (new Date()).setMinutes(20,0);
            // else if(new Date().getMinutes()<40)
            //     fixDate = (new Date()).setMinutes(40,0);
            // else if(new Date().getMinutes()<60)
            //     fixDate = (new Date()).setMinutes(60,0);
            fixDate = (new Date()).setMinutes(setTime,0);

            this.setState({fixDate, diff: this.fixDate - (new Date()).getTime()});
        }
    }

    render() {
        let { diff } = this.state;
        let hours = Math.floor(diff/(60*60*1000));

        let mins = Math.floor((diff-(hours*60*60*1000))/(60*1000));
        if(isNaN(mins)) mins = 20;
        else if (mins < 10) mins = '0' + mins;

        let secs = Math.floor((diff-(hours*60*60*1000)-(mins*60*1000))/1000);
        if(isNaN(secs)) secs = '00';
        else if (secs < 10) secs = '0' + secs;

        let	getCurrentTime = this.props.getCurrentTime;
        getCurrentTime(mins,secs);
        
        return (
            <React.Fragment>
                {mins}:{secs}
            </React.Fragment>
        );
    }
}


const mapStateToProps = state => {
    const {  authentication: {user} } = state;
    return {
        user
    };
};

const connectedRpsGame = connect(mapStateToProps)(TimeCounter);
export default connectedRpsGame;