import React, {Component, Fragment} from 'react';
import SideBar from '../components/SideBar';
import {div, Col, Container, Row} from "react-bootstrap";
import Axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import {Redirect} from 'react-router';
import API from './../api/api';

class HomePage extends Component {
	constructor() {
        super();
        this.state={
            dataList:[],
            redirectStatus : false,
            total_customer : '',
            total_meal : '',
            total_cancel_meal : '',
            total_bazar_cost : '',
            total_earnings : '',
            total_user_due : '',
            today_lunch_order : '',
            today_dinner_order : '',

        }
    }
     componentDidMount() {
        let user = localStorage.getItem('login');
        if(user==null)
        {
            this.setState({redirectStatus: true});
        }

        Axios.get(API.AdminDashboardSummary).then((response)=>{
            if(response.status==200){
                this.setState({
                                total_customer : response.data.total_customer,
                                total_meal : response.data.total_meal,
                                total_cancel_meal : response.data.total_cancel_meal,
                                total_bazar_cost : response.data.total_bazar_cost,
                                total_earnings : response.data.total_earnings,
                                total_user_due : response.data.total_user_due,
                                today_lunch_order : response.data.today_lunch_order,
                                today_dinner_order : response.data.today_dinner_order,

                             })
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
       const months = ["January", "February", "March", 
                        "April", "May", "June", 
                        "July", "August", "September", 
                        "October", "November", "December"];
    	const {total_customer, total_meal, total_cancel_meal, total_bazar_cost, total_earnings, total_user_due, today_lunch_order, today_dinner_order} = this.state;
        return (
            <Fragment>
            	<SideBar title="Home">
                		 <div className="container-fluid animated zoomIn">
                                        <h4 className="text-center bg-danger text-light p-2 my-2">Admin Dashboard</h4>
             <h3 className="text-center bg-light text-success p-2 my-2">Month of <span>{months[new Date().getMonth()]}</span> <span className="text-danger">{new Date().getFullYear()}</span></h3>
             <hr/>
                                    
                                        <div className="card text-center m-1">
                                        <div className="card-body">
                                            <h5 className="title-text">{total_customer}</h5>
                                            <h5 className="des-text text-danger"><b>Total Customer</b></h5>
                                        </div>
                                    </div>
                               
                                    <div className="card text-center m-1">
                                        <div className="card-body">
                                            <h5 className="title-text">{total_meal}</h5>
                                            <h5 className="des-text text-danger"><b>Total Meal</b></h5>
                                        </div>
                                    </div>
                            
                                    <div className="card text-center m-1">
                                        <div className="card-body">
                                            <h5 className="title-text">{total_cancel_meal}</h5>
                                            <h5 className="des-text text-danger"><b>Total Cancel Meal</b></h5>
                                        </div>
                                    </div>
                              
                                    <div className="card text-center m-1">
                                        <div className="card-body">
                                            <h5 className="title-text">{total_bazar_cost}TK</h5>
                                            <h5 className="des-text text-danger"><b>Total Bazar Cost</b></h5>
                                        </div>
                                    </div>
                             
                                    <div className="card text-center m-1">
                                        <div className="card-body">
                                            <h5 className="title-text">{total_earnings}TK</h5>
                                            <h5 className="des-text text-danger"><b>Total Earnings</b></h5>
                                        </div>
                                    </div>
                              
                                    <div className="card text-center m-1">
                                        <div className="card-body">
                                            <h5 className="title-text">{total_user_due}TK</h5>
                                            <h5 className="des-text text-danger"><b>Total Previous User Due</b></h5>
                                        </div>
                                    </div>
                              
                                    <div className="card text-center m-1">
                                        <div className="card-body">
                                            <h5 className="title-text">{today_lunch_order}</h5>
                                            <h5 className="des-text text-danger"><b>Today Lunch Order</b></h5>
                                        </div>
                                    </div>
                               
                                    <div className="card text-center m-1">
                                        <div className="card-body">
                                            <h5 className="title-text">{today_dinner_order}</h5>
                                            <h5 className="des-text text-danger"><b>Today Dinner Order</b></h5>
                                        </div>
                                    </div>
                                    
                                
                                
                            
                        </div>
                </SideBar>
                {this.RedirectToLogin()}
            </Fragment>
        );
    
    }
}

export default HomePage;
