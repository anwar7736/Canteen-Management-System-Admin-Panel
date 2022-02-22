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


class EmailVerify extends Component {
	constructor(){
		super()
		this.state = {
			email : '',
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

        localStorage.removeItem('email_verified');
        localStorage.removeItem('otp_verified');

    }
    EmailVerify=(e)=>{
        e.preventDefault();
        var email = this.state.email;
        var EmailRegx= /^[a-zA-Z0-9_]+@+[a-zA-Z0-9]+.+[A-z]/;
        if(email=='')
        {
            cogoToast.warn('Email address field is required!');
        } 
        else if(!EmailRegx.test(email))
        {
            cogoToast.warn('Invalid email address!');
        }

        else
        {
            Axios.post(API.EmailVerification, {email:email})
            .then(response=>{
                if(response.status==200 && response.data==1)
                {
                    cogoToast.success('Please colllect OTP from your mail');
                    setTimeout(()=>{
                        localStorage.setItem('email_verified', email);
                        this.setState({status:true});
                    },1000);
                }
                else
                {
                    cogoToast.error(response.data);
                }
            })
            .catch(error=>{
                cogoToast.error('Something went wrong!');
            })
        }
    }
    RedirectToOTPPage=()=>{
        if(this.state.status===true)
        {
            return(
                <Redirect to="/otp_verification" />
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
                <SideBar title="Email Verification">
                    <Container className="animated zoomIn">
                        <Row>
                            <Col xl={6} lg={6} md={{w:8, offset:3}} sm={12} xs={12}>
                                <h4 className="text-danger mb-4">Step 01 : Email Verification</h4>
                                <Form onSubmit={this.EmailVerify}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control type="text"  onChange={(e)=>{this.setState({email : e.target.value})}} placeholder="Enter Your Email Address Here...."/>
                                    </Form.Group>
                                    <Button className="btn form-control mb-2" variant="success" type="submit">
                                        NEXT
                                    </Button>
                                    <div className="text-center text-danger">
                                        <span ><Link to="/admin_login">Back to Login</Link></span>
                                    </div>
                                </Form>
                            </Col>
                        </Row>
                    </Container>
                </SideBar>
                {this.RedirectToOTPPage()}
                {this.RedirectToHome()}
            </Fragment>
        );
    	
     }
    
}

export default EmailVerify;
