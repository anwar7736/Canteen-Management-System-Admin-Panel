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


class OTPVerify extends Component {
	constructor(){
		super()
		this.state = {
			email : '',
            redirectStatus : false,
            status : false,
            redirectForget : false,
            isDisabled : true,
            totalSec : 300,
            verifyBtn : 'Verify OTP',
            count_down : '',

		}
	}
	componentDidMount(){
        let user = localStorage.getItem('login');
        if(user!==null)
        {
            this.setState({redirectStatus: true});
        }
        let verified_email = localStorage.getItem('email_verified');
        if(verified_email==null)
        {
            this.setState({status:true});
        }
        else
        {
            this.setState({email : verified_email});
        }

        const timer = setInterval(this.countDown,1000); 
        Axios.post(API.GetOTPExpiration, {email : verified_email})
        .then(response=>{
            if(response.data < 0)
            {
                this.setState({status : true});
            }
            else{
                this.setState({totalSec : response.data});
            }
            
        })
        .catch(error=>{

        })    
        

    }

    componentWillUnmount()
    {
        clearInterval(this.timer);
    }

    countDown=()=>{
    var totalSec = this.state.totalSec;
     var min = Math.floor(totalSec / 60);
     var sec = (totalSec % 60);
     if(min < 10)
     {
         min = '0' + min;
     }

     if(sec < 10)
     {
         sec = '0' + sec;
     }
     if(totalSec==0)
     {
       clearInterval(totalSec);
       return this.setState({status : true, totalSec : ''});
     }
     else{
           this.setState({'count_down':  min + ':' + sec}); 
           this.state.totalSec--;
     }
   
     }

    OTPChange=(e)=>{
        let otp = e.target.value;
        this.setState({otp : otp});
        if(otp.length===6)
        {
            this.setState({isDisabled:false});
        }
        else
        {
            this.setState({isDisabled:true});
        }
    }
    OTPVerify=(e)=>{
        e.preventDefault();
        var email = this.state.email;
        var otp = this.state.otp;

            Axios.post(API.OTPVerification, {email:email, otp : otp})
            .then(response=>{
                if(response.status==200 && response.data==1)
                {
                    cogoToast.success('OTP Verification Successfully');
                    setTimeout(()=>{
                        localStorage.setItem('otp_verified', email);
                        localStorage.removeItem('email_verified');
                        this.setState({redirectForget:true});
                    },1000);
                }
                else
                {
                    cogoToast.error('Invalid OTP Code!');
                }
            })
            .catch(error=>{
                cogoToast.error('Something went wrong!');
            })
        }
    
        RedirectToEmailVerify=()=>{
            if(this.state.status===true)
            {
                return(
                    <Redirect to="/email_verification" />
                )
            }
        } 
        RedirectToForgetPassword=()=>{
            if(this.state.redirectForget===true)
            {
                return(
                    <Redirect to="/forget_password" />
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
                <SideBar title="OTP Verification">
                    <Container>
                        <Row>
                            <Col xl={6} lg={6} md={{w:8, offset:3}} sm={12} xs={12}>
                               <h2 className="text-center text-danger">Step 02 : OTP Verification</h2>
                             <p>We've already sent 6 digits OTP number in this email : {this.state.email}</p><hr/>
                             <p>This OTP will be expired within <span id="count_down" className="text-danger">{this.state.count_down}</span></p>
                             <hr/>
                                <Form onSubmit={this.OTPVerify}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>OTP Code</Form.Label>
                                        <Form.Control type="text"  maxLength="6" onChange={this.OTPChange} placeholder="Enter Your Valid OTP Code...."/>
                                    </Form.Group>
                                    <Button className="btn-block mb-2" variant="danger" type="submit" disabled={this.state.isDisabled}>
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
                {this.RedirectToForgetPassword()}
                {this.RedirectToEmailVerify()}
                {this.RedirectToHome()}
            </Fragment>
        );
    	
     }
    
}

export default OTPVerify;
