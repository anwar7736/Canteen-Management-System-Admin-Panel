import React, {Component, Fragment} from 'react';
import SideBar from '../components/SideBar';

class NotFoundPage extends Component {
    render() {
        return (
            <Fragment>
            	<SideBar title="404 page not found">
               		<h1 className="text-danger text-center">404 page not found</h1>
                </SideBar>
            </Fragment>
        );
    }
}

export default NotFoundPage;
