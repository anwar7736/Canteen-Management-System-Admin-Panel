import React, {Component, Fragment} from 'react';
import SideBar from '../components/SideBar';
import {Card, Col, Container, Row} from "react-bootstrap";
import Axios from "axios";
import LoadingDiv from "../components/loadingDiv";
import WentWrong from "../components/wentWrong";
import { ToastContainer, toast } from 'react-toastify';
import {Redirect} from 'react-router';

class HomePage extends Component {
	constructor() {
        super();
        this.state={
            dataList:[],
            isLoading:true,
            isError:false,
            redirectStatus : false,
        }
    }
     componentDidMount() {
        let user = localStorage.getItem('login');
        if(user==null)
        {
            this.setState({redirectStatus: true});
        }

        Axios.get('/CountSummary').then((response)=>{
            if(response.status==200){
                this.setState({dataList:response.data,isLoading:false,isError:false})
            }
            else{
                this.setState({isLoading:false,isError:true})
            }
        }).catch((error)=>{
            this.setState({isLoading:false,isError:true})
        })
    }
    RedirectToLogin=()=>{
        if(this.state.redirectStatus===true)
        {
            return(
                <Redirect to="/admin_login" />
            )
        }
    }
    render() {
        if(this.state.isLoading==true && this.state.isError==false)
        {
            return (
                    <SideBar title="Home">   
                        <Container>
                            <LoadingDiv/>
                        </Container>
                    </SideBar>
                )
        }

    	const data = this.state.dataList;
        return (
            <Fragment>
            	<SideBar title="Home">
                		 <Container fluid={true} className="animated zoomIn">
                            <Row>
                                <Col className="p-2" md={3} log={3} sm={6}>
                                    <Card className="card text-center">
                                        <Card.Body>
                                            <h5 className="title-text">0</h5>
                                            <h5 className="des-text text-danger"><b>Total Customer</b></h5>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col className="p-2" md={3} log={3} sm={6}>
                                    <Card className="card text-center">
                                        <Card.Body>
                                            <h5 className="title-text">0</h5>
                                            <h5 className="des-text text-danger"><b>Total Meal</b></h5>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col className="p-2" md={3} log={3} sm={6}>
                                    <Card className="card text-center">
                                        <Card.Body>
                                            <h5 className="title-text">0</h5>
                                            <h5 className="des-text text-danger"><b>Total Cancel Meal</b></h5>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col className="p-2" md={3} log={3} sm={6}>
                                    <Card className="card text-center">
                                        <Card.Body>
                                            <h5 className="title-text">0</h5>
                                            <h5 className="des-text text-danger"><b>Total Bazar Cost</b></h5>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col className="p-2" md={3} log={3} sm={6}>
                                    <Card className="card text-center">
                                        <Card.Body>
                                            <h5 className="title-text">0</h5>
                                            <h5 className="des-text text-danger"><b>Total Earnings</b></h5>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col className="p-2" md={3} log={3} sm={6}>
                                    <Card className="card text-center">
                                        <Card.Body>
                                            <h5 className="title-text">0</h5>
                                            <h5 className="des-text text-danger"><b>Total Previous Due</b></h5>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col className="p-2" md={3} log={3} sm={6}>
                                    <Card className="card text-center">
                                        <Card.Body>
                                            <h5 className="title-text">0</h5>
                                            <h5 className="des-text text-danger"><b>Today Lunch Order</b></h5>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col className="p-2" md={3} log={3} sm={6}>
                                    <Card className="card text-center">
                                        <Card.Body>
                                            <h5 className="title-text">0</h5>
                                            <h5 className="des-text text-danger"><b>Today Dinner Order</b></h5>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                
                            </Row>
                        </Container>
                </SideBar>
                {this.RedirectToLogin()}
            </Fragment>
        );
    
    }
}

export default HomePage;
