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



class LoginPage extends Component {
	constructor(){
		super()
		this.state = {
			username : 'admin1234',
            password : '123',
            redirectStatus : false,

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
    AdminLogin=(e)=>{
        e.preventDefault();

        const {username, password} = this.state;

        if(username=='')
        {
            cogoToast.warn('Username field is required!');
        } 
        else if(password=='')
        {
            cogoToast.warn('Password field is required!');
        }

        else
        {
            const MyForm = new FormData();
            MyForm.append('username', username);
            MyForm.append('password', password);

            Axios.post(API.login, MyForm)
            .then(response=>{
                if(response.status==200 && response.data!==0)
                {
                    localStorage.setItem('login', username);
                    localStorage.setItem('id', response.data['id']);
                    localStorage.setItem('email', response.data['email']);
                    localStorage.setItem('phone', response.data['phone']);
                    this.setState({redirectStatus:true});
                }
                else
                {
                    cogoToast.error('Username or Pasword Wrong!');
                }
            })
            .catch(error=>{
                cogoToast.error('Something went wrong!');
            })
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
        const {username, password} = this.state;
        return (
            <Fragment>
                <SideBar title="Admin Login">
                    <Container className="animated zoomIn">
                        <Row>
                            <Col xl={6} lg={6} md={{w:8, offset:3}} sm={12} xs={12}>
                                <h2 className="text-danger mb-4 text-center">Admin Login</h2>
                                <Form onSubmit={this.AdminLogin}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control type="text"  value={username} onChange={(e)=>{this.setState({username : e.target.value})}} placeholder="Enter Your Username...."/>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                        <Form.Control value={password} onChange={(e)=>{this.setState({password : e.target.value})}} type="password" placeholder="Enter Your Password..." />
                                    </Form.Group> 
                                    <Button className="btn form-control mb-2" variant="success" type="submit">
                                        LOGIN
                                    </Button>
                                    <div className="text-center text-danger">
                                        <span ><Link to="/email_verification">Forgotten Password?</Link></span>
                                    </div>
                                </Form>
                            </Col>
                        </Row>
                    </Container>
                </SideBar>
                {this.RedirectToHome()}
            </Fragment>
        );
    	
     }
    
}

export default LoginPage;
