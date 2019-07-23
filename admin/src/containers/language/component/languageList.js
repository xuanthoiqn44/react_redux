import React, {Component} from "react";
import {Button, Container} from "reactstrap";
import {connect} from "react-redux";
import ReactTable from "react-table";
import "react-table/react-table.css";
import {languageAction} from "../../../redux/actions/languageActions";
import {translationAction} from "../../../redux/actions/translationActions";

class LanguageList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.user._id,
            filtered: [],
            selected: {},
            translation: [],
        };
        this.toggleRow = this.toggleRow.bind(this);
    };

    componentWillMount() {
        this.props.onGetLanguages(this.state.userId);
        this.props.onGetTranslation();
    }

    componentDidMount() {
        if(typeof this.props.language !== "undefined" && this.props.language.length !== 0) {
            let newSelected = Object.assign({}, this.state.selected);
            for (let val of this.props.language) {
                newSelected[val] = !this.state.selected[val];
                this.setState({
                    selected: newSelected
                });
            }
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {translation} = nextProps;
        if(translation){
            this.setState({
                translation
            })
        }
    }

    toggleRow = (value) => {
        const newSelected = Object.assign({}, this.state.selected);
        newSelected[value] = !this.state.selected[value];
        this.setState({
            selected: newSelected
        });
    };

    onHandleUpdateSelected = () => {
        const { userId, selected } = this.state;
        let temp = [];
        for (let val of this.state.translation) {
            if(selected[val.characters]) {
                temp.push(val.characters)
            }
        }
        if(temp.length === 0) {
            alert('Language is not choose !')
        } else {
            const selectedData = {
                languages : temp
            };
            this.props.onSelectedLanguage(selectedData);
            const dataUpdate = {
                userId,
                languages : temp,
            };
            this.props.onUpdateLanguage(dataUpdate)
        }
    };

    onFilteredChangeCustom = (value, accessor) => {
        let filtered = this.state.filtered;
        let insertNewFilter = 1;

        if (filtered.length) {
            filtered.forEach((filter, i) => {
                if (filter["id"] === accessor) {
                    if (value === "" || !value.length) filtered.splice(i, 1);
                    else filter["value"] = value;
                    insertNewFilter = 0;
                }
            });
        }

        if (insertNewFilter) {
            filtered.push({ id: accessor, value: value });
        }
        this.setState({ filtered: filtered });
    };

    render() {
        const {translation} = this.state;
        return (
            <Container>
                <div className='card_title_notification'>
                    <h5 className='bold-text'>Languages List</h5>
                    <Button color='primary' type='button' onClick={() => this.onHandleUpdateSelected()}>
                        Save
                    </Button>
                </div>
                <div>
                    <ReactTable
                        data = {translation}
                        filterable
                        filtered={this.state.filtered}
                        onFilteredChange={(filtered, columns, value) => {
                            this.onFilteredChangeCustom(value, columns.id || columns.accessor);
                        }}
                        defaultFilterMethod={(filter, row) => {
                            const id = filter.pivotId || filter.id;
                            if (typeof filter.value === "object") {
                                return row[id] !== undefined
                                    ? filter.value.indexOf(row[id]) > -1
                                    : true;
                            } else {
                                return row[id] !== undefined
                                    ? String(row[id]).indexOf(filter.value) > -1
                                    : true;
                            }
                        }}
                        columns = {[
                            {
                                columns: [
                                    {
                                        expander: true,
                                        width: 0
                                    },
                                    {
                                        Header: "Language",
                                        accessor: "language",
                                    },
                                    {
                                        Header: "Characters",
                                        accessor: "characters",
                                    },
                                    {
                                        Header: "Chooses",
                                        id: "checkbox",
                                        accessor: "",
                                        filterable: false,
                                        Cell: (props) => {
                                            return (
                                                <div className= "action-container">
                                                    <input
                                                        type="checkbox"
                                                        className="checkbox"
                                                        checked={this.state.selected[props.row._original.characters] === true}
                                                        onChange={() => this.toggleRow(props.row._original.characters)}
                                                    />
                                                </div>
                                            );
                                        }
                                    },
                                ]
                            }
                        ]}
                        defaultPageSize = {10}
                        className = "-striped -highlight"
                    />
                </div>
            </Container>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    onGetLanguages : (userId) => dispatch(languageAction.get(userId)),
    onUpdateLanguage: (param) => dispatch(languageAction.update(param)),
    onSelectedLanguage: (param) => dispatch(languageAction.selectedLang(param)),
    onGetTranslation : () => dispatch(translationAction.get()),
});

function mapStateToProps(state)
{
    const { language: {language}, users: {user}, translation: {translation} } = state;
    return {
        language,
        user,
        translation,
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(LanguageList)
