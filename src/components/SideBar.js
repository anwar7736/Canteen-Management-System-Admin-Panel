import React, {Component, Fragment} from 'react';
import {Navbar,NavLink} from "react-bootstrap";
import {Redirect} from 'react-router';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faHome,faEnvelope,faBookOpen,faCode,faFolder,faComment,faPowerOff, faKey} from "@fortawesome/free-solid-svg-icons";
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
            
             user==null ? 
                <>
                     <NavLink><a className="NavItem" to="/admin_login"> <FontAwesomeIcon icon={faPowerOff} /> <span className={this.state.NavText}>Sign In</span></a></NavLink>
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
                    <b>Admin Dashboard</b>
                </Navbar>

                <div className={this.state.sideNavClass}>
                    <NavLink> <Link className="NavItem" to="/"> <FontAwesomeIcon icon={faHome} /> <span className={this.state.NavText}>Home</span> </Link></NavLink>
                    <NavLink><Link className="NavItem" to="/contact"> <FontAwesomeIcon icon={faEnvelope} /> <span className={this.state.NavText}>Contact</span></Link></NavLink>
                    <NavLink><Link className="NavItem" to="/course"> <FontAwesomeIcon icon={faBookOpen} /> <span className={this.state.NavText}>Courses</span></Link></NavLink>
                    <NavLink><Link className="NavItem" to="/project"> <FontAwesomeIcon icon={faCode} /> <span className={this.state.NavText}>Projects</span></Link></NavLink>
                    <NavLink><Link className="NavItem" to="/services"> <FontAwesomeIcon icon={faFolder} /> <span className={this.state.NavText}>Services</span></Link></NavLink>
                    <NavLink><Link className="NavItem" to="/review"> <FontAwesomeIcon icon={faComment} /> <span className={this.state.NavText}>Review</span></Link></NavLink>
                    <NavLink><Link className="NavItem" to="/changePassword"> <FontAwesomeIcon icon={faKey} /> <span className={this.state.NavText}>Change Password</span></Link></NavLink>
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
