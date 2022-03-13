import React, {Component, Fragment} from 'react';
import {Navbar,NavLink} from "react-bootstrap";
import {Redirect} from 'react-router';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faHeart, faHome,faEnvelope,faBookOpen,faCode,faFolder,faComment,faPowerOff, faKey, faUser, faShoppingCart} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Axios from 'axios';
import API from './../api/api';

class SideBar extends Component {

    constructor(props) {
        super();
        this.state={
            sideNav:false,
            sideNavClass:"sidenavClose",
            NavText:"d-none",
            mainDivOverlay:"main-overlay-close",
            redirectStatus : false,
            countLatest : "",
            user_id : "",
        }
    }

    componentDidMount(){
        const user_id = localStorage.getItem('id');
        this.setState({user_id : user_id});
        Axios.get(API.CountLastest + user_id)
            .then(res=>{
                this.setState({countLatest :  res.data});
            })
            .catch(err=>{

            })
    }


    showHideSideNav=()=>{
        if(this.state.sideNav===false){
            this.setState({sideNav:true,NavText:"",sideNavClass:"sidenavOpen",mainDivOverlay:"main-overlay-open"})
        } 
        else {
            this.setState({sideNav:false,NavText:"d-none",sideNavClass:"sidenavClose",mainDivOverlay:"main-overlay-close"})
        }
    }

    Logout=()=>
    {
        localStorage.clear();
        this.setState({redirectStatus:true});
    }

    changeLatest=()=>{
        const {user_id, countLatest} = this.state;
        if(countLatest !== "")
        {
            Axios.get(API.SetUnreadStatus + user_id)
            .then(res=>{
                this.componentDidMount();
            })
            .catch(err=>{

            });
        }
    }

    RedirectToLogin=()=>{
        if(this.state.redirectStatus===true)
        {
            return(
                <Redirect to="/admin_login"/>
            )
        }
    }
    render() {
        let user = localStorage.getItem('login');
        const {countLatest}  = this.state;
        let login_logout = 
            
             !user ? 
                <>
                     <NavLink><Link className="NavItem" to="/admin_login"> <FontAwesomeIcon icon={faPowerOff} /> <span className={this.state.NavText}>Sign In</span></Link></NavLink>
                </>
             :
             
            <>
                 <NavLink><a className="NavItem" onClick={this.Logout} > <FontAwesomeIcon icon={faPowerOff} /> <span className={this.state.NavText}>Sign Out</span></a></NavLink>
            </>
        
        return (
            <Fragment>
                <title>{this.props.title}</title>
                <Navbar  expand="lg" className="fixed-top shadow-sm bg-white mb-5 py-3" variant="light" bg="white">
                    <Navbar.Brand onClick={this.showHideSideNav} style={{cursor:'pointer'}}><FontAwesomeIcon icon={faBars} /></Navbar.Brand>
                    <b className="text-danger">Canteen Management System</b>
                </Navbar>

                <div className={this.state.sideNavClass}>
                    <NavLink> <Link className="NavItem" to="/"> <FontAwesomeIcon icon={faHome} /> <span className={this.state.NavText}>Home</span> </Link></NavLink>
                    <NavLink onClick={this.changeLatest} ><Link className="NavItem" to="/notification"> <FontAwesomeIcon icon={faHeart} /> <span className={this.state.NavText}>Notification <sup><span className="badge text-white bg-danger" style={{fontSize:'11px'}}>{countLatest == 0 ? "" : countLatest}</span></sup></span></Link></NavLink>
                    <NavLink><Link className="NavItem" to="/member"> <FontAwesomeIcon icon={faUser} /> <span className={this.state.NavText}>Customer</span></Link></NavLink>
                    <NavLink><Link className="NavItem" to="/daily_meal_item"> <FontAwesomeIcon icon={faBookOpen} /> <span className={this.state.NavText}>Daily Meal Item</span></Link></NavLink> 
                    <NavLink><Link className="NavItem" to="/send_notification"> <FontAwesomeIcon icon={faEnvelope} /> <span className={this.state.NavText}>Send Notification</span></Link></NavLink>
                    <NavLink><Link className="NavItem" to="/make_payment"> <FontAwesomeIcon icon={faShoppingCart} /> <span className={this.state.NavText}>Make Payment</span></Link></NavLink>
                    <NavLink><Link className="NavItem" to="/order_daily_meal"> <FontAwesomeIcon icon={faComment} /> <span className={this.state.NavText}>Order Daily Meal</span></Link></NavLink>
                    <NavLink><Link className="NavItem" to="/day_wise_meal_report"> <FontAwesomeIcon icon={faComment} /> <span className={this.state.NavText}>Day Wise Meal Report</span></Link></NavLink>
                    <NavLink><Link className="NavItem" to="/daily_bazar_cost"> <FontAwesomeIcon icon={faComment} /> <span className={this.state.NavText}>Daily Bazar Cost</span></Link></NavLink>
                    <NavLink><Link className="NavItem" to="/review"> <FontAwesomeIcon icon={faComment} /> <span className={this.state.NavText}>Database Backup</span></Link></NavLink>
                    <NavLink><Link className="NavItem" to="/changePassword"> <FontAwesomeIcon icon={faKey} /> <span className={this.state.NavText}>Change Password</span></Link></NavLink>
                    <NavLink><Link className="NavItem" to="/review"> <FontAwesomeIcon icon={faComment} /> <span className={this.state.NavText}>Reports</span></Link></NavLink>
                    <NavLink><Link className="NavItem" to="/changePassword"> <FontAwesomeIcon icon={faKey} /> <span className={this.state.NavText}>Settings</span></Link></NavLink>
                   {
                       login_logout
                   }
            
                </div>
                <div onClick={this.showHideSideNav} className={this.state.mainDivOverlay}>

                </div>
                <div className="mainDiv">
                    {this.props.children}
                     <ToastContainer/>
                </div>
                {this.RedirectToLogin()}
            </Fragment>
        );
    }
}

export default SideBar;
