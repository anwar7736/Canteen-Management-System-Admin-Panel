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
import API from './../api/api';

class ChangePassword extends Component {
	constructor(){
		super()
		this.state = {
			user : '',
            oldPass : '',
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

        const id = localStorage.getItem('id');
        const {oldPass, newPass, confirmPass} = this.state;

        if(oldPass=='')
        {
            cogoToast.warn('Old password field is required!');
        }
        else if(newPass=='')
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
            const myData = new FormData();
            myData.append('id', id);
            myData.append('oldpass', oldPass);
            myData.append('newpass', newPass);
            Axios.post(API.ChangePassword, myData)
            .then(response=>{
                if(response.status==200 && response.data==1)
                {
                    cogoToast.success('Password Updated Successfully');
                    setTimeout(()=>{
                        localStorage.clear();
                        this.setState({redirectStatus : true});
                    },2000);
                }
                else if(response.status==200 && response.data==0)
                {
                    cogoToast.error('Old Password Did Not Match!');
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
                    <Container className="animated zoomIn">
                        <Row>
                            <Col xl={6} lg={6} md={{w:8, offset:3}} sm={12} xs={12}>
                                <h4 className="text-danger mb-5">Change Password</h4>
                                <Form onSubmit={this.ChangePassword}>
                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Old Password</Form.Label>
                                        <Form.Control onChange={(e)=>{this.setState({oldPass : e.target.value})}} type="password" placeholder="Enter Old Password" />
                                    </Form.Group> 
                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>New Password</Form.Label>
                                        <Form.Control onChange={(e)=>{this.setState({newPass : e.target.value})}} type="password" placeholder="Enter New Password" />
                                    </Form.Group> 

                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Confirm Password</Form.Label>
                                        <Form.Control onChange={(e)=>{this.setState({confirmPass : e.target.value})}} type="password" placeholder="Re-type New Password" />
                                    </Form.Group>
                                    <Button className="btn form-control" variant="success" type="submit">
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
