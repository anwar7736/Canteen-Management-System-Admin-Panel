import React, {Component, Fragment} from 'react';
import {Navbar,NavLink} from "react-bootstrap";
import {Redirect} from 'react-router';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faHeart, faHome,faEnvelope,faBookOpen,faCode,faFolder,faComment,faPowerOff, faKey} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
class SideBar extends Component {

    constructor(props) {
        super();
        this.state={
            sideNav:false,
            sideNavClass:"sidenavClose",
            NavText:"d-none",
            mainDivOverlay:"main-overlay-close",
            redirectStatus : false,
        }
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
                    <NavLink><Link className="NavItem" to="/daily_meal_item"> <FontAwesomeIcon icon={faBookOpen} /> <span className={this.state.NavText}>Notification</span></Link></NavLink>
                    <NavLink><Link className="NavItem" to="/member"> <FontAwesomeIcon icon={faEnvelope} /> <span className={this.state.NavText}>Member</span></Link></NavLink>
                    <NavLink><Link className="NavItem" to="/daily_meal_item"> <FontAwesomeIcon icon={faBookOpen} /> <span className={this.state.NavText}>Daily Meal Item</span></Link></NavLink> 
                    <NavLink><Link className="NavItem" to="/send_notification"> <FontAwesomeIcon icon={faHeart} /> <span className={this.state.NavText}>Send Notification</span></Link></NavLink>
                    <NavLink><Link className="NavItem" to="/make_payment"> <FontAwesomeIcon icon={faFolder} /> <span className={this.state.NavText}>Make Payment</span></Link></NavLink>
                    <NavLink><Link className="NavItem" to="/order_daily_meal"> <FontAwesomeIcon icon={faComment} /> <span className={this.state.NavText}>Order Daily Meal</span></Link></NavLink>
                    <NavLink><Link className="NavItem" to="/review"> <FontAwesomeIcon icon={faComment} /> <span className={this.state.NavText}>Daily Bazar Cost</span></Link></NavLink>
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
