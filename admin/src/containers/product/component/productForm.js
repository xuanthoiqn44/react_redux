/* eslint no-eval: 0 */
import React, {Component} from 'react'
import { Container, Nav, NavItem,NavLink,Button, Col, Row, Collapse, FormGroup } from "reactstrap";
import htmlToDraft from 'html-to-draftjs';
import {convertToRaw, EditorState, ContentState} from "draft-js";
import classNames from 'classnames';
import {Editor} from 'react-draft-wysiwyg';
import draftToHtml from "draftjs-to-html";
import CurrencyInput from "react-currency-input";
import CloseIcon from 'mdi-react/CloseIcon';
import BinIcon from 'mdi-react/BinIcon';
import EditIcon from 'mdi-react/EditIcon';
import CancelIcon from 'mdi-react/CancelIcon';
import CheckIcon from 'mdi-react/CheckIcon';
import MultiSelect from "@khanacademy/react-multi-select";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Checkbox from 'material-ui/Checkbox';
import Chip from 'material-ui/Chip';
import {productActions} from "../../../redux/actions/productActions";
import CategoryForm from "../../category/component/categoryForm";
import {categoryAction} from "../../../redux/actions/categoryActions";
import {translate} from "react-i18next";
import {connect} from "react-redux";
import "./style.scss";
import {languageAction} from "../../../redux/actions/languageActions";
import {translationAction} from "../../../redux/actions/translationActions";
import Alert from "../../../components/Alert";
import PlusBoxIcon from "mdi-react/PlusIcon";

const muiTheme = getMuiTheme({});
const ToolbarOptions = {
    options: ['inline', 'blockType', 'list', 'textAlign', 'link', 'emoji', 'history'],
    inline: {
        options: ['bold', 'italic', 'underline']
    }
};

class ProductForm extends Component {
    constructor(props){
        super(props);
        this.state = ({
            status: 'Default',
            userId: this.props.user._id,
            flag: this.props.flag,

            modal: false,
            editCate: false,
            submitted:false ,
            limitUpload: false,
            errorImage: false,
            errorTotal: false,
            isDisableUpdateButton: true,

            title: [],
            editorName : [],
            image: [],
            path: [],
            categories: [],
            categoryId: [],
            listSelected: [],
            translation: [],
        });
        this.onFlagChange = this.onFlagChange.bind(this);
    }

    componentWillMount() {
        this.props.getCategory(this.state.userId);
        this.props.onGetLanguages(this.state.userId);
        this.props.onGetProducts(this.state.userId);
        this.props.onGetTranslation();
        this.handleLanguageOnChange(this.props.defaultLanguage);
    }
    componentDidMount() {
        if(typeof this.props.receiveData !== "undefined")
        {
            const {receiveData: {detail:{_id, price, sale, content, statusSent,status,categoryId, path}}} = this.props;

            const editContentEditors = [];
            let editorState;
            for (var key in content) {
                const data = htmlToDraft(content[key]);
                if(data.contentBlocks){
                    const contentState = ContentState.createFromBlockArray(data.contentBlocks);
                    editorState = EditorState.createWithContent(contentState);
                }
                editContentEditors.push([key,editorState]);
            }

            if(editContentEditors && typeof editContentEditors !== 'undefined'){
                this.setState({
                    _id,price,sale,status,categoryId,editMode: true,statusSent,isDisableUpdateButton: false,path,
                    editContentEditors
                });
            }
            const title = this.props.receiveData.detail.title;
            this.setState({
                title:  title
            });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(typeof prevProps.products !== 'undefined' && typeof this.props.products !== 'undefined'){
            if(this.props.products.length !== prevProps.products.length){
                this.props.onGetProducts(this.state.userId);
            }
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {categories, translation} = nextProps;
        if(categories){
            this.setState({
                categories
            })
        }
        if(translation){
            this.setState({
                translation
            })
        }

        (async () => {
            if(typeof this.props.categories !== 'undefined' && !this.state.flag){
                await this.setState({
                    categories: this.props.categories
                });
            }
        })();
    }

    onFlagChange(newFlag){
        this.setState({
            flag : newFlag
        });
    }
    onHandleDeleteCate = (rowData) => {
        if(this.state.flag){
            this.setState({
                flag: !this.state.flag,
            });
        }
        this.setState({
            categoryId: this.state.categoryId
                .filter(option => option.id !== rowData.id),
            // modal: !this.state.modal,
        });
        this.props.onDeleteCategory({rowData});
        this.props.getCategory(this.state.userId);
    };
    handleTitleOnChange = (e) => {
        const { name, value } = e.target;
        const { title } = this.state;
        this.setState({
            title: {
                ...title,
                [name]: value
            }
        });
    };
    onEditorStateChange = (e) => {
        let lang = this.state.language || 'vn';
        let tempedit = [];
        if(this.state.editContentEditors) {
            for( let a of this.state.editContentEditors){
                let lang = {}, content ={ }, contentConvert = {};
                lang = a[0];
                content = a[1];
                contentConvert = draftToHtml(convertToRaw(a[1].getCurrentContent()));
                tempedit.push({contentConvert,content,lang});
            }
        }
        let temp = this.state.editorName;
        if(temp)  {
            let findIndex = -1;
            for(let i = 0; i<temp.length; i++) {
                if(temp[i].lang === lang) {
                    temp[i].contentConvert = draftToHtml(convertToRaw(e.getCurrentContent()));
                    temp[i].content = e;
                    findIndex = i;
                    break;
                }
            }
            if(findIndex === -1) {
                temp.push({
                    contentConvert: draftToHtml(convertToRaw(e.getCurrentContent())),
                    content: e,
                    lang: lang
                });
            }
        }
        if((temp.length < this.props.language.length) && this.state.editContentEditors) {
            let returnTarget = Object.assign(temp, tempedit);
            this.setState({
                editorName : returnTarget
            });
        }
        else{
            this.setState({
                editorName : temp
            });
        }
    };
    onHandleSubmitForm = (e,state) => {
        e.preventDefault();
        this.setState({submitted : true});
        let total = 0;
        let contentEditor = {} ;
        let tempt = [];
        const {language} = this.props;
        this.state.editorName.map((item) => {
            contentEditor[item.lang] = item.contentConvert;
            return contentEditor;
        });

        const {title , price, sale, image, status, categoryId, userId,listSelected} = this.state;
        const data = {
            image,title ,price,sale,status,listSelected,categoryId,userId ,
            content : contentEditor
        };
        for( let val of data.image ){
            total = total + val.length;
        }
        if(total > 97241) {
            this.setState({
                errorTotal: true
            });
        } else {
            language.map((item) => {
                let titleLang = eval('title.' + item);
                let  dataContent  = eval('data.content.' +item);
                if(typeof titleLang === 'undefined' || titleLang === ''||typeof dataContent === 'undefined' || dataContent === '') {
                    this.handleLanguageOnChange(item);
                    this.setState({
                        nameLanguage: item
                    });
                    tempt.push(item);
                }
            });
            if (tempt.length === 0) {
                this.props.onProductionSubmitCreate(data);
                this.handleLanguageOnChange(this.props.defaultLanguage);
                this.props.toggleNewProduct(state);
                this.setState({
                    title:[],
                    price: '',
                    sale: '',
                    status: 'Default',
                    content: '',
                    editorName:[],
                    image:[],
                    categoryId:[],
                    listSelected: [],
                    submitted: false
                });
                for ( let val of this.state.categories ) {
                    if(val.flags) {
                        val.flags = false;
                        this.props.updateFlagsCategory(val);
                    }
                }
            }
            (async () => {
                await new Promise((resolve) => {
                    this.props.onGetProducts(this.state.userId);
                    resolve(true);
                })
            })();
        }
    };
    onHandleUpdateForm = () => {
        let contentEditor= {} ;
        let total = 0;
        let tempt = [];
        const {language} = this.props;

        if(this.state.editorName.length !== 0 ) {
            this.state.editorName.map((item) => {
                contentEditor[item.lang] = item.contentConvert;
                return contentEditor;
            });
        }
        else{
            if(typeof this.props.receiveData.detail.content !== "undefined") {
                contentEditor = this.props.receiveData.detail.content;
            }
        }
        const {_id,title, price, sale, image, status,listSelected, categoryId, userId,path} = this.state;
        const dataUpdate = {
            _id,image,title,price,sale,status,categoryId,userId ,listSelected,path,
            content: contentEditor
        };
        for( let val of dataUpdate.image.concat(dataUpdate.path) ){
            total = total + val.length;
        }
        if(total > 97241) {
            this.setState({
                errorTotal: true
            })
        } else {
            language.map((item) => {
                let titleLang = eval('title.' + item);
                if(typeof titleLang === 'undefined' || titleLang === '') {
                    this.handleLanguageOnChange(item);
                    tempt.push(item);
                }
                else if (tempt.length === 0) {
                    this.props.onUpdateProduction(dataUpdate);
                    this.props.onGetProducts(this.state.userId);
                    this.handleLanguageOnChange(this.props.defaultLanguage);
                    this.props.onHandleCloseSub('true');
                    for ( let val of this.state.categories ) {
                        if(val.flags) {
                            val.flags = false;
                            this.props.updateFlagsCategory(val);
                        }
                    }
                }
            });
        }
    };
    onHandleCloseForm = (state) => {
        this.setState({product:[],price: '',sale: '',status: 'Default', listSelected: [],ckEditorState: [],image:[],categoryId:[]});
        this.props.toggleNewProduct(state);
        for ( let val of this.state.categories ) {
            if(val.flags) {
                val.flags = false;
                this.props.updateFlagsCategory(val);
            }
        }
    };
    handlePriceOnChange = (e) => {
        this.setState({ price : e, isDisableUpdateButton : false });
    };
    handleSaleOnChange = (e) => {
        this.setState({sale : e , isDisableUpdateButton : false });
    };
    onHandleImageChange = (e) => {
        this.setState({image: e.target.value , isDisableUpdateButton: false})
    };
    handleImageChange = (e) => {
        e.preventDefault();
        const listImage = this.state.path.concat(this.state.image);
        let files = Array.from(e.target.files);
        if(listImage.length > 2) {
            this.setState({ limitUpload: true});
        } else {
            files.forEach((file) => {
                if (file.size > 90971) {
                    this.setState({ errorImage : true});
                } else {
                    let reader = new FileReader();
                    reader.onloadend = () => {
                        this.setState({
                            image: [...this.state.image, reader.result],
                        });
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    };
    onHandleClearImage = () => {
        this.setState({
            errorImage: false,
            limitUpload:false,
            image: [],
            path: [],
            isDisableUpdateButton: false,
            errorTotal: false,
        });
    };
    removeLoadedFile = (index) => {
        const n = this.state.path.concat(this.state.image)
        for ( let i = 0; i < n.length; i++ ) {
            if ( i === index ) {
                if( i > this.state.path.length - 1 ) {
                    this.state.image.splice(i - this.state.path.length, 1);
                    this.setState({
                        image: [...this.state.image],
                        errorTotal: false,
                    });
                } else {
                    this.state.path.splice(i, 1);
                    this.setState({
                        path: [...this.state.path],
                        errorTotal: false,
                    });
                }
            }
        }
    };
    toggleNewCategory = (state) => {
        this.props.collapseTable(state);
    };
    handleStatusOnChange = (e) => {
        this.setState({status: e.target.value , isDisableUpdateButton: false})
    };
    renderOption = ({ checked, option, onClick }) => {
        return (
            <div>
                <Checkbox
                    label={option.label}
                    onCheck={onClick}
                    checked={checked}
                />
            </div>
        )
    };
    renderSelected = (selected, options) => {
        if (!selected.length) {
            return <span className={"title-dropdown-heading-value"}>Select categories</span>;
        } else {
            return (
                <div className='wrapper'>
                    {
                        selected.map((value) => {
                            return (
                                <Chip
                                    key={value.id}
                                    className='chip'
                                    onRequestDelete={this.handleUnselectItem( value )}
                                >
                                    {options.find( opt => opt.value.id === value.id ).value.title}
                                </Chip>
                            )
                        })
                    }
                </div>
            )
        }
    };
    handleUnselectItem = (removedVal) => () => (
        ( this.setState({
            categoryId: this.state.categoryId
                .filter(option => option.id !== removedVal.id)
        }),
            removedVal.flags = false,
            this.props.updateFlagsCategory(removedVal) )
    );
    toggleButtonDelete = () => {
        this.setState(prevState => ({
            modal: !prevState.modal,
        }));
    };
    handleEditCategory = (val) => {
        this.setState({
            editCate: !this.state.editCate,
            idEdit: val.id,
            titleCate: val.title
        });
    };
    handleCloseEditCategory = () => {
        this.setState({
            editCate: !this.state.editCate,
        });
    };
    handleSubmitEditCategory = (val) => {
        this.setState({
            editCate: !this.state.editCate,
        });
        val.title = this.state.titleCate;
        val.flags = false;
        this.props.updateCategory(val);
    };
    handleTitleCateOnChange = (e) => {
        this.setState({titleCate: e.target.value});
    };
    handleLanguageOnChange = (e,lang) => {
        this.setState({
            nameLanguage: lang
        });
        this.setLanguage(e);

        this.setState({
            activeTab: e
        });

    };
    setLanguage = async (state) => {
        this.setState({
            language: state
        });
    };

    render() {
        const {
            title,
            errorImage,
            limitUpload,
            errorTotal,
            price,
            sale,
            editorName,
            editMode,
            statusSent,
            categories,
            categoryId ,
            listSelected,
            isDisableUpdateButton,
            editCate,
            idEdit,
            titleCate,
            submitted,
            image,
            path,
            editContentEditors,
            nameLanguage,
            translation
        } = this.state;
        const myVarTitle = eval('title.'+ this.state.language);
        const { alert, language,defaultLanguage, t } = this.props;
        let newCategories = categories.map((Cate) => {
            return {
                label:
                    <div style={{display: 'inline-block'}} key={Cate.id}>
                        { idEdit === Cate.id && editCate
                            ? <input type="text" value={titleCate ? titleCate : ''} onChange={this.handleTitleCateOnChange} />
                            : Cate.title
                        }
                        { idEdit === Cate.id && editCate &&
                        <div>
                            <div style={{marginRight: 30}} className='button-primary' onClick={() => this.handleSubmitEditCategory(Cate)} >
                                <CheckIcon style={{pointerEvents: "none"}}/>
                            </div>
                            <div className='button-danger' onClick={() => this.handleCloseEditCategory()} >
                                <CancelIcon style={{pointerEvents: "none"}}/>
                            </div>
                        </div>
                        }
                        { !editCate &&
                        <div style={{marginRight: 30}} className='button-warning' onClick={() => this.handleEditCategory(Cate)} >
                            <EditIcon style={{pointerEvents: "none"}}/>
                        </div>
                        }
                        {
                            !editCate &&   <div className='button-danger' onClick={() => this.onHandleDeleteCate(Cate)} >
                                <BinIcon style={{pointerEvents: "none"}}/>
                            </div>
                        }
                    </div>,
                value: Cate
            }
        });

        var listTemp = [];
        for ( let val of categories ) {
            if(val.flags) {
                listTemp.push(val)
            } else {
                for ( let temp of categoryId ) {
                    if(typeof temp === "object") {
                        if (temp.id === val.id) {
                            listTemp.push(val)
                        }
                    } else {
                        if (temp === val.id) {
                            listTemp.push(val)
                        }
                    }
                }
            }
        }
        listSelected.length = 0;
        for ( let value of listTemp ) {
            if(!listSelected.includes(value)) {
                listSelected.push(value)
            }
        }

        let contentEditor = editorName.filter((item)=> {
            if(item.lang === this.state.language) {
                return item;
            }
            return false;
        }).map((item) => {
            return item.content;
        });
        const editorStateNew = contentEditor[0];
        let editContent;
        if(editContentEditors !== '' && typeof editContentEditors !== 'undefined'){
            let contentEdit =  editContentEditors.map((item) => {
                    if(item[0]=== this.state.language){
                        return item[1];
                    }
                }
            );
            if(contentEdit) {
                for(let i = 0 ; i < contentEdit.length; i++ ) {
                    if( typeof contentEdit[i] !== 'undefined'){
                        editContent = contentEdit[i];
                    }
                }
            }
            else {
                editContent =''
            }
        }
        let firstLang = [];
        let listLanguages = [];
        if(typeof language !== 'undefined' && language.length !== 0) {
            for ( let a of language ) {
                for ( let b of translation ) {
                    if(a === b.characters && !listLanguages.includes(b)){
                        if(b.language === 'English'){
                            firstLang.push(b)
                        }
                        else{
                            listLanguages.push(b)

                        }
                    }
                }
            }
        }
        let listArrayLanguage = firstLang.concat(listLanguages);
        return (
            <Container>
                <div>
                    <Nav tabs>
                        { listArrayLanguage.map((lag, index) => {
                            let lang = lag.language.substr(0,2);

                            return (
                                <NavItem key={index}>
                                    <NavLink
                                        className={classNames({ active: this.state.activeTab === lag.characters})}
                                        onClick={()=>{ this.handleLanguageOnChange(lag.characters,lang)}}
                                    >
                                        <div>{lag.language}</div>
                                    </NavLink>
                                </NavItem>
                            )
                        })}
                    </Nav>
                    <Row>
                        <Col sm="12" lg="6" xs="12">
                            <div className="addNotification-form-container" >
                                <form className='material-form' name="formproduct" id='form' >
                                    <div className="form-group" >
                                        <div className={'form-group' + (submitted && !myVarTitle ? ' has-error' : '')}>
                                            <label className="font-weight-bold">{t('nameLanguage.replaceNameProduct')} ({nameLanguage ? nameLanguage : this.props.defaultLanguage })  </label>
                                            <input type="text" className={'form-control' + (title? ' title' : ' ')} name={'' + this.state.language}
                                                   placeholder={t('nameLanguage.renameProductRequired')}
                                                   pattern="/^[a-zA-Z]/"
                                                   value={myVarTitle || ''}
                                                   onChange={this.handleTitleOnChange}/>
                                            {submitted && !myVarTitle &&
                                            <div className="help-block" style={{ color: '#ff0000' }}>NameProduct is required</div>
                                            }
                                        </div>
                                        <label className=" font-weight-bold">{t('nameLanguage.replacePrice')}</label>
                                        <CurrencyInput precision="0"
                                                       className='form-control'
                                                       name="Price"
                                                       pattern="[0-9]*"
                                                       maxLength="15"
                                                       onChange={this.handlePriceOnChange}
                                                       value={price ? price : ''} />
                                        <label className=" font-weight-bold">{t('nameLanguage.replaceSold')}</label>
                                        <CurrencyInput precision="0"
                                                       className='form-control'
                                                       name="Sale"
                                                       pattern="[0-9]*"
                                                       maxLength="15"
                                                       onChange={this.handleSaleOnChange}
                                                       value={sale ? sale : ''} />
                                        <label className=" font-weight-bold">{t('nameLanguage.replaceNameCategory')}</label>

                                        { this.state.modal &&
                                        <Alert color={'danger'} className={this.props.className} isOpen={this.state.visible}>
                                            <button className='close' onClick={() => this.toggleButtonDelete()}><span className='lnr lnr-cross'/></button>
                                            <div className='alert__content'>
                                                <p>{alert.message}</p>
                                            </div>
                                        </Alert>
                                        }
                                        <div className="form form--horizontal">
                                            <div className={"form__form-group"}>
                                                <div className='form__form-group-field' >
                                                        <MuiThemeProvider muiTheme={muiTheme}>
                                                            <MultiSelect
                                                                disableSearch={true}
                                                                ItemRenderer={this.renderOption}
                                                                valueRenderer={this.renderSelected}
                                                                options={newCategories}
                                                                selected={listTemp}
                                                                onSelectedChanged={categoryId => this.setState({categoryId})}
                                                            />
                                                        </MuiThemeProvider>
                                                        <Button color="primary" className="addNewCate"
                                                                onClick ={()=>this.toggleNewCategory(this.props.collapseTab)} >
                                                            <PlusBoxIcon style={{pointerEvents: "none"}}/>
                                                        </Button >
                                                </div>
                                            </div>
                                        </div>

                                        <Collapse isOpen={this.props.collapseTab} >
                                            <CategoryForm flag = {this.state.flag} onFlagChange={this.onFlagChange}/>
                                        </Collapse>

                                        <Col lg={12} sm={12} xs={12}>
                                            <FormGroup tag="fieldset" className='pl-0' >
                                                <label className=" font-weight-bold">{t('nameLanguage.replaceStatus')}</label>
                                                <FormGroup check className='pl-0'>
                                                    <label className="radio-btn radio-btn--colored">
                                                        {(this.state.status === 'Default' &&
                                                            <input onClick={this.handleStatusOnChange}
                                                                   className="radio-btn__radio" name="radio"
                                                                   type="radio" value="Default" defaultChecked  /> )
                                                        ||(<input onClick={this.handleStatusOnChange}
                                                                  className="radio-btn__radio" name="radio"
                                                                  type="radio" value="Default" />)
                                                        }
                                                        <span className="radio-btn__radio-custom"> </span>
                                                        <span className="radio-btn__label">{t('nameLanguage.reDefault')}</span>
                                                    </label>
                                                </FormGroup>
                                                <FormGroup check>
                                                    <label className="radio-btn radio-btn--colored">
                                                        {(this.state.status === 'Pending' &&
                                                            <input onClick={this.handleStatusOnChange}
                                                                   className="radio-btn__radio" name="radio" type="radio" value="Pending" defaultChecked />)
                                                        ||(<input  onClick={this.handleStatusOnChange}
                                                                   className="radio-btn__radio" name="radio" type="radio" value="Pending" />)}
                                                        <span className="radio-btn__radio-custom"> </span>
                                                        <span className="radio-btn__label">{t('nameLanguage.rePending')}</span>
                                                    </label>
                                                </FormGroup>
                                                <FormGroup check>
                                                    <label className="radio-btn radio-btn--colored">
                                                        {(this.state.status === 'Send' && <input onClick={this.handleStatusOnChange}
                                                                                                 className="radio-btn__radio" name="radio" type="radio" value="Send" defaultChecked  />) ||
                                                        <input onClick={this.handleStatusOnChange}
                                                               className="radio-btn__radio" name="radio" type="radio" value="Send" />}
                                                        <span className="radio-btn__radio-custom"> </span>
                                                        <span className="radio-btn__label">{t('nameLanguage.reSend')}</span>
                                                    </label>
                                                </FormGroup>
                                            </FormGroup>
                                        </Col>
                                    </div>
                                </form>
                            </div>
                        </Col>
                        <Col sm="12" lg="6" xs="12">
                            <div className="addNotification-form-container" >
                                <form className='material-form' name="formproduct" >
                                    <div className="form-group" >

                                        <label className=" font-weight-bold">{t('nameLanguage.replaceEditor')} ({nameLanguage ? nameLanguage : defaultLanguage })</label>
                                        <div className="addNotification-form-container">
                                            <div className='text-editor'>
                                                <Editor editorState={editorStateNew || editContent} wrapperClassName='demo-wrapper' editorClassName='demo-editor'
                                                        onEditorStateChange={this.onEditorStateChange}
                                                        toolbar={ToolbarOptions}
                                                />
                                            </div>
                                        </div>
                                        {submitted && !editorStateNew &&
                                        <div className="help-block" style={{ color: '#ff0000' }}>{t('nameLanguage.errorEditor')}</div>
                                        }
                                        <label className=" font-weight-bold">{t('nameLanguage.replaceImage')}</label>
                                        <Row className="imagess">
                                            { path.concat(image).map((value,index) => {
                                                return (
                                                    <span key={index} className='hoverimg'>
                                                        <img src={value}
                                                             className='previewImg'
                                                             onChange={this.onHandleImageChange}
                                                             alt='previewImg'
                                                        />
                                                        <span className="remove-btn remove" onClick={() => this.removeLoadedFile(index)}>
                                                            <CloseIcon size={15}/>
                                                        </span>
                                                    </span>
                                                )
                                            })
                                            }
                                        </Row>
                                        <div className='e-file-select-wrap'>
                                            <div className="upload-btn-wrapper">
                                                <Button className="btnUploadFile" color="primary">
                                                    Upload a file
                                                    <input className="upload-btn-wrapper"
                                                           type="file"
                                                           name="myFile"
                                                           accept="image/png, image/jpeg"
                                                           onChange={this.handleImageChange}
                                                           onClick={(event)=> { event.target.value = null }}
                                                           multiple
                                                    />
                                                </Button>
                                            </div>
                                            { (image.length > 0
                                                &&  <div className="clear-btn-wrapper">
                                                    <Button className="btnCancelFile" color="primary" onClick={this.onHandleClearImage}>
                                                        {t('nameLanguage.replaceNameBtnClear')}
                                                    </Button>
                                                </div>)
                                            }
                                            { limitUpload&&
                                                <div className="help-block" style={{color: '#ff0000'}}> {t( 'nameLanguage.limitUploadImage' )}</div>
                                            }
                                            {
                                                errorImage &&
                                                <div className="help-block" style={{ color: '#ff0000' }}> {t('nameLanguage.errorUploadImage')}</div>
                                            }
                                            {
                                                errorTotal &&
                                                <div className="help-block" style={{ color: '#ff0000' }}> {t('nameLanguage.errorTotal')}</div>
                                            }

                                        </div>
                                        <hr/>
                                        <div className="button-container d-flex justify-content-end">
                                            <Button color='danger' onClick={() => this.onHandleCloseForm(this.props.toggleState)} disabled={editMode}>
                                                {t('nameLanguage.replaceNameBtnClose')}
                                            </Button>
                                            {editMode
                                                ?   <Button className='ml-2' type='button' color='primary'
                                                            onClick={(e) => this.onHandleUpdateForm(e)}
                                                            disabled={statusSent ? true : !!isDisableUpdateButton } >
                                                    {t('nameLanguage.replaceNameBtnUpdate')}
                                                </Button>
                                                :   <Button className='ml-2' type='button' color='primary'
                                                            onClick={(e) => {this.onHandleSubmitForm(e,this.props.toggleState)}}
                                                            disabled={this.props.isSubmitButtonDisabled} >
                                                    {t('nameLanguage.replaceNameBtnAddNew')}
                                                </Button>
                                            }
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    onProductionSubmitCreate: (data) => dispatch(productActions.create(data)),
    onUpdateProduction:(dataUpdate) => dispatch(productActions.update(dataUpdate)),
    toggleNewProduct: (state) => dispatch(productActions.toggleNewProduct(state)),
    onGetProducts: (userId) => dispatch(productActions.getByUserId(userId)),
    collapseTable: (state) => dispatch(productActions.collapseTable(state)),
    onDeleteCategory:(data) =>  dispatch(categoryAction.delete(data)),
    getCategory: (userId) => dispatch(categoryAction.get(userId)),
    updateFlagsCategory: (param) => dispatch(categoryAction.update(param)),
    updateCategory: (param) => dispatch(categoryAction.update(param)),
    onGetLanguages : (userId) => dispatch(languageAction.get(userId)),
    onGetTranslation : () => dispatch(translationAction.get()),
});

function mapStateToProps(state)
{
    const { product: {toggleState,collapseTab,flag ,defaultLanguage}, t ,category: {categories},users:{user},alert, language:{language}, translation: {translation} } = state;
    return {
        alert,
        t,
        toggleState,
        collapseTab,
        categories,
        user,
        language,
        translation,
        flag,
        defaultLanguage
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('common')(ProductForm))
