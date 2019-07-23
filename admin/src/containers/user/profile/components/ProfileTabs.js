import React, {PureComponent} from 'react';
import {Card, Col, Nav, NavItem, NavLink, TabContent, TabPane} from 'reactstrap';
import showResults from './Show';
import ProfileSettings from './ProfileSettings';

export default class ProfileTabs extends PureComponent {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '3'
        };
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    render() {
        return (
            <Col md={12} lg={12} xl={8}>
                <Card>
                    <div className='profile__card tabs tabs--bordered-bottom'>
                        <div className='tabs__wrap'>
                            <Nav tabs>
                                <NavItem>
                                    <NavLink
                                        className="active"
                                    >
                                        Settings
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <TabContent activeTab={this.state.activeTab}>
                                <TabPane tabId='3'>
                                    <ProfileSettings onSubmit={showResults}/>
                                </TabPane>
                            </TabContent>
                        </div>
                    </div>
                </Card>
            </Col>
        )
    }
}