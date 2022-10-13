import React, {Component, Fragment} from 'react';
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import {Link} from 'react-router-dom';
import API from '../api/api';
import {Redirect} from 'react-router';
import cogoToast from 'cogo-toast';
import Axios from 'axios';
import SideBar from '../components/SideBar';

class Settings extends Component {
       state = {
            PageRefreshStatus : false,
            shop_logo : '',
            shop_name : '',
            shop_address : '',
            shop_owner : '',
            username : '',
            owner_phone : '',
            owner_email : '',
            updateBtn : 'Submit',
            redirectStatus : false,
        }
    componentDidMount(){
        let user_id= localStorage.getItem('id');
        let user = localStorage.getItem('login');
            if(user==null)
            {
                this.setState({redirectStatus: true});
            }
        Axios.get(API.GetProfileInfo)
        .then(response=>{
            if(response.status===200)
            {
                this.setState({
                    shop_logo : response.data[0]['shop_logo'],
                    shop_name : response.data[0]['shop_name'],
                    shop_address : response.data[0]['shop_address'],
                    shop_owner : response.data[0]['shop_owner'],
                    username : response.data[0]['username'],
                    owner_phone : response.data[0]['owner_phone'],
                    owner_email : response.data[0]['owner_email'],
                })
            }
        })
        .catch(error=>{

        })
     }
    onSubmitHandler=(e)=>{
     e.preventDefault();
      const {shop_logo, shop_name, shop_address, shop_owner, username, owner_phone} = this.state;

      let MobileRegx=/^(?:\+?88|0088)?01[15-9]\d{8}$/;

       if(shop_name.length===0)
        {
            cogoToast.error('Enter shop name');
        }
        else if(shop_address.length===0)
        {
            cogoToast.error('Enter shop address');
        }
        else if(username && username.length < 3)
        {
            cogoToast.error('Username is too short!');
        }
        else if(owner_phone && !MobileRegx.test(owner_phone))
        {
             cogoToast.error('Invalid mobile number!');
        } 
        else
        {
            let MyForm = new FormData();
            MyForm.append('shop_logo', shop_logo);
            MyForm.append('shop_name', shop_name);
            MyForm.append('shop_address', shop_address);
            MyForm.append('shop_owner', shop_owner);
            MyForm.append('username', username);
            MyForm.append('owner_phone', owner_phone);

            Axios.post(API.UpdateAdminProfile, MyForm)
            .then(response=>{                

              if(response.status==200 && response.data==1)
                {
                    this.setState({PageRefreshStatus:true})
                    cogoToast.success('Admin profile updated successfully..');
                    this.componentDidMount();
                }
              else{
                     cogoToast.warn("Profile Nothing to Changes");
                }
            })
            .catch(error=>{
                 cogoToast.error('Something Went Wrong!');
            })
        
    }
}
    PageRefresh=()=>{
        if(this.state.PageRefreshStatus===true){
            let path = window.location.pathname;
            return (
                    <Redirect to={path} />
                   );
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

    render() {
        return (
            <Fragment>
              <SideBar title="Settings">
                 <div className="">
                    <div className="bg-light mt-4 animated zoomIn">
                        <Form onSubmit={this.onSubmitHandler}>
                                <h5 className="text-success text-center m-4"><b>Admin Profile</b></h5><hr/>
                          <Form.Group controlId="formBasicPassword" className="mb-3">
                            <Form.Label><b>Shop Name</b></Form.Label>
                            <Form.Control value={this.state.shop_name} onChange={(e)=>this.setState({shop_name:e.target.value})} type="text" placeholder="Enter shop name..." />
                          </Form.Group>
                          <Form.Group controlId="formBasicPassword" className="mb-3">
                            <Form.Label><b>Shop Address</b></Form.Label>
                            <Form.Control value={this.state.shop_address} onChange={(e)=>this.setState({shop_address:e.target.value})} type="text" placeholder="Enter shop address..." />
                          </Form.Group>
                          <Form.Group controlId="formPassword" className="mb-3">
                          <Form.Label><b>Owner Name</b></Form.Label>
                            <Form.Control value={this.state.shop_owner} onChange={(e)=>{this.setState({shop_owner:e.target.value})}} type="text" placeholder="Enter shop owner name..." />
                          </Form.Group> 
                          <Form.Group controlId="formPassword" className="mb-3">
                          <Form.Label><b>Username</b></Form.Label>
                            <Form.Control value={this.state.username} onChange={(e)=>{this.setState({username:e.target.value})}} type="text" placeholder="Enter username..." />
                          </Form.Group>
                          <Form.Group controlId="formPassword" className="mb-3">
                          <Form.Label><b>Owner Mobile Number</b></Form.Label>
                            <Form.Control maxLength="11" value={this.state.owner_phone} onChange={(e)=>{this.setState({owner_phone:e.target.value})}} type="text" placeholder="Enter shop owner valid mobile number..." />
                          </Form.Group> 
                          <Form.Group controlId="formPassword" className="mb-3">
                          <Form.Label><b>Owner Email Address</b></Form.Label>
                            <Form.Control disabled value={this.state.owner_email} type="text" placeholder="No need to fill up this field..." />
                          </Form.Group> 
                          <Form.Group controlId="formPassword" className="mb-3">
                          <Form.Label><b>Shop Logo</b></Form.Label><br/>
                            <img className="profile-image mb-2" src={this.state.shop_logo}/>
                            <Form.Control onChange={(e)=> this.setState({shop_logo:e.target.files[0]})} type="file" />
                          </Form.Group>
                          <Button disabled={this.state.isDisabled} variant="success" type="submit">
                          {this.state.updateBtn}
                          </Button><br/><br/>
                        </Form>
                    </div>
                 </div>
                  {this.PageRefresh()}
                   {this.RedirectToLogin()}
                 </SideBar>
            </Fragment>
        );
    }
}

export default Settings;