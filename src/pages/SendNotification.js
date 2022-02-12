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

 render(){
 	const {showReceiver, customChecked, allChecked} = this.state;
 	return(
 		<Fragment>
 		<SideBar title="Contact">
			 			<div class="row">
				<div class="col-md-6 container-fluid m-4">
			<h4><center>Send Notification Via 3 Way</center></h4>
			<hr/>
			  <div class="tab">
			    <button class="tablinks active" onClick={(event)=>this.sendVia(event, 'database')}>Database</button>
			    <button class="tablinks" onClick={(event)=>this.sendVia(event, 'email')}>E-mail</button>
			    <button class="tablinks" onClick={(event)=>this.sendVia(event, 'sms')}>SMS</button>
			  </div>

			<div id="database" class="tabcontent" style={{display:'block'}}>
				<br/>
			  <h5><center>Notification Send via Database</center></h5>
			 <hr/>
			      <form method="POST" onSubmit="">
			      <div class="form-group">
			        <label for="name">Your Name :</label>
			        <input type="text" class="form-control" value="" onChange="" placeholder="Enter your name..." id="name0"/>
			      </div>
			      <div class="form-group">
			        <label for="title">Message Title :</label>
			        <input type="text" class="form-control" value="" onChange="" placeholder="Enter message title..." id="title"/>
			      </div>
			      <div class="form-group">
			        <label for="body">Message Body :</label>
			        <textarea rows="5" class="form-control" value="" onChange="" id="body">
			        </textarea>
			      </div>
			      <button type="submit" class="btn btn-success">Send</button>
			    </form> 

			</div>

			<div id="email" class="tabcontent">
					<br/>
			   <h5><center>Notification Send via E-mail</center></h5>
			    <hr/>
			  <form method="POST" onSubmit="">
			      <div class="form-group">
			        <label for="name">From :</label>
			        <input type="email" class="form-control" value=""  disabled placeholder="Sender..." id="name2"/>
			      </div>
			      <div class="form-group">
			        <label for="name">To :</label>
			        <label>
			        	<input type="radio" className="ml-3" checked={customChecked}name="via" onClick={(e)=>this.onshowReceivers('custom')} id="custom" value=""/> Custom
			        </label>
			        <label>
			        	<input type="radio" className="ml-3" checked={allChecked}name="via" onClick={(e)=>this.onshowReceivers('all')} id="all" value=""/> All
			        </label>
			        <input type="text" className={showReceiver + " form-control"} value="" onChange="" placeholder="Enter receivers mail address..." id="name"/>
			      </div>
			      <div class="form-group">
			        <label for="title">Message Title :</label>
			        <input type="text" class="form-control" value="" onChange="" placeholder="Enter message title..." id="title"/>
			      </div>
			      <div class="form-group">
			        <label for="body">Message Body :</label>
			        <textarea rows="5" class="form-control" value="" onChange="" id="body">
			        </textarea>
			      </div>
			      <button type="submit" class="btn btn-success">Send</button>
			    </form> 
			</div>

			<div id="sms" class="tabcontent">
				<br/>
			   <h5><center>Notification Send via SMS</center></h5>
			    <hr/>
			  <form method="POST" onSubmit="">
			  			      <div class="form-group">
			  			        <label for="name">Sender Mobile Number :</label>
			  			        <input type="email" class="form-control" value=""  disabled placeholder="Enter your name..." id="name2"/>
			  			      </div>
			  			      <div class="form-group">
			  			        <label for="name">Receivers Mobile Number :</label>
			  			        <label>
			  			        	<input type="radio" className="ml-3" checked name="via" onclick="showReceiver('custom')" id="custom" value=""/> Custom
			  			        </label>
			  			        <label>
			  			        	<input type="radio" className="ml-3" name="via" onclick="showReceiver('all')" id="all" value=""/> All
			  			        </label>
			  			        <input type="text" class="form-control" value="" onChange="" placeholder="Enter receivers mail addresses..." id="name"/>
			  			      </div>
			  			      <div class="form-group">
			  			        <label for="title">Message Title :</label>
			  			        <input type="text" class="form-control" value="" onChange="" placeholder="Enter message title..." id="title"/>
			  			      </div>
			  			      <div class="form-group">
			  			        <label for="body">Message Body :</label>
			  			        <textarea rows="5" class="form-control" value="" onChange="" id="body">
			  			        </textarea>
			  			      </div>
			  			      <button type="submit" class="btn btn-success">Send</button>
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

 		</Fragment>
 		)
 	
 }
}
export default SendNotification;