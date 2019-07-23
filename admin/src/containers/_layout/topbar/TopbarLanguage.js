import React, {PureComponent} from 'react';
import {languageAction} from "../../../redux/actions/languageActions";
import {connect} from "react-redux";
import ReactFlagsSelect from 'react-flags-select';
import {translate} from "react-i18next";

//import css module
import 'react-flags-select/css/react-flags-select.css';
//OR import sass module
import 'react-flags-select/scss/react-flags-select.scss';

class TopbarLanguage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    componentDidMount() {
         this.setLanguage('en');
    }
   
    onSelectFlag =(countryCode) =>{
        let lang = countryCode.toLowerCase();
        if(lang === 'us') {
            lang = lang.replace( 'us', 'en' );
        }
        this.props.onChangeStateLanguage(lang);
        this.setLanguage(lang);
    };
    setLanguage = async (state) => {
        await this.props.i18n.changeLanguage(state);
    };
    render() {
        const {selectedLanguage,language} = this.props;
        let data;
        if(typeof selectedLanguage !== "undefined" && selectedLanguage !== '') {
            data = selectedLanguage.languages.map( (item) => {
               if (item === 'en') {
                   item = item.replace( 'en', 'US' );
               }
               data = item.toUpperCase();
               return data;
           } );
        }
        else if(selectedLanguage === '' && typeof language !== "undefined") {
            data = language.map( (item) => {
                if (item === 'en') {
                    item = item.replace( 'en', 'US' );
                }
                data = item.toUpperCase();
                return data;
            } );
        }

        return (

            <div className='d-flex align-items-center '>
                <ReactFlagsSelect
                    defaultCountry={"US"}
                    countries={data}
                    showSelectedLabel={false}
                    selectedSize={25}
                    onSelect={(e)=> this.onSelectFlag(e)}
                />

            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    onGetLanguages : (userId) => dispatch(languageAction.get(userId)),
    onChangeStateLanguage: (state) => dispatch(languageAction.changeState(state)),

});
function mapStateToProps(state) {
    const {  language:{language,stateLanguage,selectedLanguage},t} = state;
    return {
        language,
        stateLanguage,
        t,
        selectedLanguage
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(translate('common')(TopbarLanguage))
