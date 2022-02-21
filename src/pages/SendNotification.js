import React, {Component, Fragment} from 'react';
import {Button, Card, Col, Container, Modal, Row} from "react-bootstrap";
import cogoToast from 'cogo-toast';
import API from './../api/api';
import {Redirect} from 'react-router-dom';
import {Link} from "react-router-dom";
import Axios from 'axios';
import SideBar from '../components/SideBar';
import DataTable from "react-data-table-component";

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
		data : [],
		show : false,
		editID : '',
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

        Axios.get(API.GetAllNotificationForAdmin + id)
        .then(res=>{
        	this.setState({data : res.data});
        })
        .catch(err=>{

        });
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
		 	myForm.append('receivers', 'ForAllUser');

			 // if(receivers.length==0)
			 // {
			 // 	myForm.append('receivers', 'ForAllUser');
			 // }

			 // else{
			 // 		myForm.append('receivers', receivers);
			 // }

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

handleOpen=()=>{
	this.setState({show:true});
}

handleClose=()=>{
	this.setState({show:false});
	this.clearForm();
}

clearForm=()=>{
	this.setState({author_name : '', msg_title : '', msg_body : '', receivers : ''});
}

editIconOnClick=(id)=>{
	this.setState({editID : id});
	Axios.get(API.GetNotification + id)
	.then(res=>{
		this.setState({
			author_name : res.data[0].author_name,
			msg_title : res.data[0].msg_title,
			msg_body : res.data[0].msg_body,
		});
	}).
	catch(err=>{

	});

	this.handleOpen();
}

deleteIconOnClick=(id)=>{
	Axios.get(API.DeleteNotification + id)
	.then(res=>{
		if(res.status == 200 && res.data == 1)
			{
				cogoToast.success('Notification has been deleted!');
				this.componentDidMount();
			}
			else{
				cogoToast.error('Something went wrong!');
			}
	})
	.catch(err=>{
		cogoToast.error('Something went wrong!');
	});
}

EditNotification=()=>{
	const{editID, author_name, msg_title, msg_body} = this.state;
	if(msg_title=='')
		{
			 cogoToast.error('Message title field is required!')
		}

	else if(msg_body=='')
	{
		 cogoToast.error('Message description field is required!')
	}
	else {
			let myForm = new FormData();
			myForm.append('notify_id', editID);
			myForm.append('author_name', author_name);
			myForm.append('msg_title', msg_title);
			myForm.append('msg_body', msg_body);
		Axios.post(API.EditNotification, myForm)
		.then(res=>{
			if(res.status == 200 && res.data == 1)
			{
				cogoToast.success('Notification has been updated');
				this.clearForm();
				this.handleClose();
				this.componentDidMount();
			}
			else{
				cogoToast.error('Something went wrong!');
			}
		})
		.catch(err=>{
			cogoToast.error('Something went wrong!');
		})
	}
}

 render(){
 	const {data, show, showReceiver, customChecked, allChecked, author_name, msg_title, msg_body, sender_email, sender_mobile, receivers} = this.state;
 	const columns = [
            {
                name: 'Author',
                selector: 'author_name',
                sortable: true,

            },
            {
                name: 'Title',
                selector: 'msg_title',
                sortable: true,
            },
            {
                name: 'Message',
                selector: 'msg_body',
                sortable: true,
            },
            {
                name: 'Date',
                selector: 'create_date',
                sortable: true,
            }, 
            {
                name: 'Delete',
                selector: 'id',
                sortable: false,
                cell: row => <button onClick={()=>{
                    if(window.confirm('Do you want to delete today order?')) 
                    {
                        this.deleteIconOnClick(row.id);
                    }
                   }
                }
                  className="btn btn-sm text-danger"><i className="fa fa-trash-alt"/></button>
            },
            {
                name: 'Edit',
                selector: 'id',
                sortable: false,
                cell: row => <button onClick={this.editIconOnClick.bind(this,row.id)}  className="btn btn-sm text-success"><i className="fa fa-edit"/></button>
            },
        ];
 	return(
 		<Fragment>
 		<SideBar title="Send Notification">
			<div class="row animated zoomIn">
				<div class="col-md-6 container-fluid m-4">
			<h4 className="text-danger"><center>Send Notification</center></h4>
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
			      {/*
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
			      */}
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
			<h4 className="text-danger"><center>All Sending Notification List</center></h4><hr/>
				  <DataTable
	                noHeader={true}
	                paginationPerPage={5}
	                pagination={true}
	                columns={columns}
	                data={data} />
			</div>
			</div>
 		</SideBar>
 		<Modal scrollable={true} animation={false} className="animated zoomIn" show={show} onHide={show}>
                    <Modal.Header>
                        <strong><p className="text-danger">Edit Notification</p></strong>
                    </Modal.Header>
                    <Modal.Body>
                        <label className="form-label"><b>Author Name</b></label>
                        <input value={author_name} className="form-control onChange={(e)=>this.setState({author_name:e.target.value})} form-control-sm" type="text"/> <br/>
                        <label className="form-label"><b>Message Title</b></label>
                        <textarea value={msg_title} onChange={(e)=>this.setState({msg_title:e.target.value})} className="form-control form-control-sm" type="text"/><br/>
                         <label className="form-label"><b>Message Body</b></label>
                        <textarea value={msg_body} onChange={(e)=>this.setState({msg_body:e.target.value})} className="form-control form-control-sm" type="text"/><br/> 
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="btn-sm btn-danger" onClick={this.handleClose}>
                            Close
                        </Button>
                        <button  className="btn btn-sm btn-success"  onClick={this.EditNotification}>
                            Update
                        </button>
                    </Modal.Footer>
            </Modal>
 		 {this.RedirectToLogin()}
 		</Fragment>
 		)
 	
 }
}
export default SendNotification;