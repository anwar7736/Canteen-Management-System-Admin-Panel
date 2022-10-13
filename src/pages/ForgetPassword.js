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
import {Link} from "react-router-dom";
import {Redirect} from 'react-router';
import API from './../api/api';


class ForgetPassword extends Component {
	constructor(){
		super()
		this.state = {
			email : '',
            newPass : '',
            confirmPass : '',
            redirectStatus : false,
            status : false,

		}
	}
	componentDidMount(){
        let user = localStorage.getItem('login');
        if(user!==null)
        {
            this.setState({redirectStatus: true});
        }
        var verified_otp = localStorage.getItem('otp_verified');
        if(verified_otp==null)
        {
            this.setState({status:true});
        }
        else
        {
            this.setState({email : verified_otp});
        }
        

    }

    onResetPassword=(e)=>{
        e.preventDefault();
        var email = this.state.email;
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
            var MyForm = new FormData();
            MyForm.append('email', email);
            MyForm.append('password', confirmPass);
            Axios.post(API.ResetPassword, MyForm)
            .then(response=>{
                if(response.status==200 && response.data==1)
                {
                    cogoToast.success('Password Reset Successfully');
                    setTimeout(()=>{
                        localStorage.removeItem('otp_verified');
                        this.setState({status : true});
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
            if(this.state.status===true)
            {
                return(
                    <Redirect to="/admin_login" />
                )
            }
        } 
    RedirectToHome=()=>{
        if(this.state.redirectStatus===true)
        {
            return(
                <Redirect to="/" />
            )
        }
    }
    render(){
        return (
            <Fragment>
                <SideBar title="Reset Password">
                    <Container className="animated zoomIn">
                                <h4 className="text-danger mb-4">Step 03 : Reset Password</h4>
                                <Form onSubmit={this.onResetPassword}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control type="text" value={this.state.email} readOnly/>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>New Password</Form.Label>
                                        <Form.Control onChange={(e)=>{this.setState({newPass : e.target.value})}} type="password" placeholder="Enter New Password" />
                                    </Form.Group> 

                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Confirm Password</Form.Label>
                                        <Form.Control onChange={(e)=>{this.setState({confirmPass : e.target.value})}} type="password" placeholder="Re-type New Password" />
                                    </Form.Group>
                                    <Button className="btn-block mb-3" variant="info" type="submit">
                                        Reset Now
                                    </Button>
                                    <div className="text-center text-danger">
                                        <span ><Link to="/email_verification">Back to Email Verify</Link></span>
                                    </div>
                                </Form>
                    </Container>
                </SideBar>
                {this.RedirectToLogin()}
                {this.RedirectToHome()}
            </Fragment>
        );
    	
     }
    
}

export default ForgetPassword;
