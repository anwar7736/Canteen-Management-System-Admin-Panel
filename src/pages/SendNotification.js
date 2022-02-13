import React, {Component, Fragment} from 'react';
import {Button, Card, Col, Container, Modal, Row} from "react-bootstrap";
import cogoToast from 'cogo-toast';
import API from './../api/api';
import {Redirect} from 'react-router-dom';
import {Link} from "react-router-dom";
import Axios from 'axios';
import SideBar from '../components/SideBar';

class SendNotification extends React.Component{
	state = {
		showReceiver : 'd-none',
		customChecked : false,
		allChecked : true,
		redirectStatus : false,
		name : '',
		author_id : '',
		author_name  : '',
		msg_title : '',
		msg_body : '',
		sender_mobile : '',
		sender_email : '',
		receivers : '',
	}

	componentDidMount()
	{
		 let user = localStorage.getItem('login');
		 let id = localStorage.getItem('id');
		 let email = localStorage.getItem('email');
		 let phone = localStorage.getItem('phone');
        if(user==null)
        {
            this.setState({redirectStatus: true});
        }
        else{
        	this.setState({author_id: id, sender_email:email, sender_mobile:phone});
        }
	}

	SendMessage=(e)=>{
		e.preventDefault();
		const {author_id, author_name, msg_title, msg_body} = this.state;

		if(author_name=='')
		{
			 cogoToast.error('Name field is required!')
		}
		else if(msg_title=='')
		{
			 cogoToast.error('Message title field is required!')
		}
		else if(msg_body=='')
		{
			 cogoToast.error('Message description field is required!')
		}
		else{

			this.setState({submitBtn : 'Submitting...', isDisabled : true});
			let MyForm = new FormData();
			MyForm.append('author_id', author_id);
			MyForm.append('author_role', 'admin');
			MyForm.append('author_name', author_name);
			MyForm.append('msg_title', msg_title);
			MyForm.append('msg_body', msg_body);
			Axios.post(API.SendMessage, MyForm)
	                 .then(response=>{
	                   if(response.status===200)
	                   {
	                   		cogoToast.success('Message has been sent.');
							   this.setState({
								submitBtn : 'Submit', 
								isDisabled : false, 
							});
							this.clearForm();
	                   }
	                   else
	                   {
							this.setState({
								submitBtn : 'Submit', 
								isDisabled : false,
							});
							this.clearForm();
							cogoToast.error('Something went wrong!');
	                   }
	                 })
	                 .catch(error=>{
	                   cogoToast.error('Something went wrong!');
	                 })
			}
	}

	sendEmail=(e)=>{
		e.preventDefault();

		const {receivers, msg_title, msg_body, customChecked, allChecked} = this.state;
		let EmailRegx= /^[a-zA-Z0-9_]+@+[a-zA-Z0-9]+.+[A-z]/;

		if(msg_title=='')
		{
			 cogoToast.error('Message title field is required!')
		}

		else if(msg_body=='')
		{
			 cogoToast.error('Message description field is required!')
		}

		else if(customChecked && receivers.length==0)
		{
			 cogoToast.error('Receivers field is required!')
		}

		else if(customChecked && !EmailRegx.test(receivers))
        {
             cogoToast.error('Invalid Email Address!');
        } 
		else{

			let myForm = new FormData();
		 	myForm.append('msg_title', msg_title);
		 	myForm.append('msg_body', msg_body);

			 if(receivers.length==0)
			 {
			 	myForm.append('receivers', 'ForAllUser');
			 }

			 else{
			 		myForm.append('receivers', receivers);
			 }

			 Axios.post(API.SendEmailNotification, myForm)
			 	.then(res=>{
			 		if(res.status === 200 && res.data === 1)
			 		{
			 			cogoToast.success('Message has been sent...');
			 			this.clearForm();
			 		}
			 		else {
			 			 cogoToast.error('Something went wrong!');
			 			 this.clearForm();
			 		}
			 	})
			 	.catch(err=>{
			 		 cogoToast.error('Something went wrong!');
			 	})

			}



	}

	onshowReceivers=(action)=>
	{
		if(action==='custom')
	    {
	    	 this.setState({showReceiver : '', customChecked : true, allChecked : false});
	    }
	    else
	    {
	    	this.setState({showReceiver : 'd-none', customChecked : false, allChecked : true});
	    }
	}
	sendVia = (evt, cityName)=> {
	  let i, tabcontent, tablinks;
	  tabcontent = document.getElementsByClassName("tabcontent");
	  for (i = 0; i < tabcontent.length; i++) {
	    tabcontent[i].style.display = "none";
	  }
	  tablinks = document.getElementsByClassName("tablinks");
	  for (i = 0; i < tablinks.length; i++) {
	    tablinks[i].className = tablinks[i].className.replace(" active", "");
	  }
	  document.getElementById(cityName).style.display = "block";
	  evt.currentTarget.className += " active";
	}

    RedirectToLogin=()=>{
    if(this.state.redirectStatus===true)
    {
        return(
            <Redirect to="/admin_login" />
        )
    }
}

clearForm=()=>{
	this.setState({author_name : '', msg_title : '', msg_body : '', receivers : ''});
}

 render(){
 	const {showReceiver, customChecked, allChecked, author_name, msg_title, msg_body, sender_email, sender_mobile, receivers} = this.state;
 	return(
 		<Fragment>
 		<SideBar title="Contact">
			<div class="row animated zoomIn">
				<div class="col-md-6 container-fluid m-4">
			<h4><center>Send Notification</center></h4>
			<hr/>
			  <div class="tab">
			    <button class="tablinks active" onClick={(event)=>this.sendVia(event, 'database')}>Database</button>
			    <button class="tablinks" onClick={(event)=>this.sendVia(event, 'email')}>E-mail</button>
			  </div>

			<div id="database" class="tabcontent" style={{display:'block'}}>
				<br/>
			  <h5><center>Notification Send via Database</center></h5>
			 <hr/>
			   <form method="POST" onSubmit={this.SendMessage}>
			      <div class="form-group">
			        <label for="name">Your Name :</label>
			        <input type="text" class="form-control" value={author_name} onChange={(e)=>this.setState({author_name:e.target.value})} placeholder="Enter your name..." id="name0"/>
			      </div>
			      <div class="form-group">
			        <label for="title">Message Title :</label>
			        <input type="text" class="form-control" value={msg_title}  onChange={(e)=>this.setState({msg_title:e.target.value})} placeholder="Enter message title..." id="title"/>
			      </div>
			      <div class="form-group">
			        <label for="body">Message Body :</label>
			        <textarea rows="5" class="form-control" value={msg_body}  onChange={(e)=>this.setState({msg_body:e.target.value})} id="body">
			        </textarea>
			      </div>
			      <button type="submit" class="btn btn-success">Send</button>
			   	  <button type="button" onClick={this.clearForm} class="btn btn-danger ml-3">Clear</button>
			    </form>   


			</div>

			<div id="email" class="tabcontent">
					<br/>
			   <h5><center>Notification Send via E-mail</center></h5>
			    <hr/>
			  <form method="POST" onSubmit={this.sendEmail}>
			      <div class="form-group">
			        <label for="name">From :</label>
			        <input type="email" class="form-control" value={sender_email}  disabled placeholder="Sender email address..." id="name2"/>
			      </div>
			      <div class="form-group">
			        <label for="name">To :</label>
			        <label>
			        	<input type="radio" className="ml-3" checked={customChecked}name="via" onClick={(e)=>this.onshowReceivers('custom')} id="custom" value=""/> Custom
			        </label>
			        <label>
			        	<input type="radio" className="ml-3" checked={allChecked}name="via" onClick={(e)=>this.onshowReceivers('all')} id="all" value=""/> All
			        </label>
			        <input type="text" className={showReceiver + " form-control"} value={receivers}  onChange={(e)=>this.setState({receivers:e.target.value})} placeholder="Enter receivers mail address..." id="name"/>
			      </div>
			      <div class="form-group">
			        <label for="title">Message Title :</label>
			        <input type="text" class="form-control" value={msg_title}  onChange={(e)=>this.setState({msg_title:e.target.value})} placeholder="Enter message title..." id="title"/>
			      </div>
			      <div class="form-group">
			        <label for="body">Message Body :</label>
			        <textarea rows="5" class="form-control" value={msg_body}  onChange={(e)=>this.setState({msg_body:e.target.value})} id="body">
			        </textarea>
			      </div>
			      <button type="submit" class="btn btn-success">Send</button>
			      <button type="button" onClick={this.clearForm} class="btn btn-danger ml-3">Clear</button>
			    </form> 
			</div>
			</div>
			<div class="col-md-5 m-4">
			<h4>All Notification List</h4>
			  <table class="table table-dark">
			    <thead>
			      <tr>
			        <th>Firstname</th>
			        <th>Lastname</th>
			        <th>Email</th>
			      </tr>
			    </thead>
			    <tbody>
			      <tr>
			        <td>John</td>
			        <td>Doe</td>
			        <td>john@example.com</td>
			      </tr>
			      <tr>
			        <td>Mary</td>
			        <td>Moe</td>
			        <td>mary@example.com</td>
			      </tr>
			      <tr>
			        <td>July</td>
			        <td>Dooley</td>
			        <td>july@example.com</td>
			      </tr>
			    </tbody>
			  </table>
			</div>
			</div>
 		</SideBar>
 		 {this.RedirectToLogin()}
 		</Fragment>
 		)
 	
 }
}
export default SendNotification;