import React, {Component, Fragment} from 'react';
import Loading from '../components/loadingDiv';
import Error from '../components/wentWrong';
import {Button, Container, Form, Row, Col} from 'react-bootstrap';
import SideBar from '../components/SideBar';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory from 'react-bootstrap-table2-editor';
import swal from 'sweetalert';
import { ToastContainer, toast } from 'react-toastify';
import Axios from 'axios';
import cogoToast from 'cogo-toast';
import {Redirect} from 'react-router';

class ChangePassword extends Component {
	constructor(){
		super()
		this.state = {
			user : '',
            newPass : '',
            confirmPass : '',
            redirectStatus : false,

		}
	}
	componentDidMount(){
        let user = localStorage.getItem('login');
        if(user!==null)
        {
            this.setState({user: user});
        }
        if(user==null)
        {
            this.setState({redirectStatus: true});
        }
    }
    ChangePassword=(e)=>{
        e.preventDefault();
        var user = this.state.user;
        var newPass = this.state.newPass;
        var confirmPass = this.state.confirmPass;
        if(newPass=='')
        {
            cogoToast.warn('New password field is required!');
        }
        else if(newPass.length < 3)
        {
            cogoToast.warn('New Password is too short!');
        } 
        else if(confirmPass=='')
        {
            cogoToast.warn('Confirm password field is required!');
        }
        else if(newPass!==confirmPass)
        {
            cogoToast.error('Both password does not match!');
        }
        else
        {
            Axios.post('/ChangePassword', {user: user, new_pass : newPass})
            .then(response=>{
                if(response.status==200 && response.data==1)
                {
                    cogoToast.success('Password Updated Successfully');
                    setTimeout(()=>{
                        localStorage.clear();
                        this.setState({redirectStatus : true});
                    },2000);
                }
                else
                {
                    cogoToast.error('Something went wrong!');
                }
            })
            .catch(error=>{
                cogoToast.error('Something went wrong!');
            })
        }
    }

    RedirectToLogin=()=>{
        if(this.state.redirectStatus===true)
        {
            return(
                <Redirect to="/admin_login" />
            )
        }
    }
    render(){
        return (
            <Fragment>
                <SideBar title="Change Password">
                    <Container>
                        <Row>
                            <Col xl={6} lg={6} md={{w:8, offset:3}} sm={12} xs={12}>
                                <h4 className="text-danger mb-5">Change Password</h4>
                                <Form onSubmit={this.ChangePassword}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control type="text" value={this.state.user} readOnly/>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>New Password</Form.Label>
                                        <Form.Control onChange={(e)=>{this.setState({newPass : e.target.value})}} type="password" placeholder="Enter New Password" />
                                    </Form.Group> 

                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Confirm Password</Form.Label>
                                        <Form.Control onChange={(e)=>{this.setState({confirmPass : e.target.value})}} type="password" placeholder="Re-type New Password" />
                                    </Form.Group>
                                    <Button className="btn-block" variant="success" type="submit">
                                        Update Now
                                    </Button>
                                </Form>
                            </Col>
                        </Row>
                    </Container>
                </SideBar>
                {this.RedirectToLogin()}
            </Fragment>
        );
    	
     }
    
}

export default ChangePassword;
