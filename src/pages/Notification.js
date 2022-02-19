import React, {Component} from 'react';
import cogoToast from 'cogo-toast';
import API from './../api/api';
import {Redirect} from 'react-router-dom';
import Axios from 'axios';
import SideBar from '../components/SideBar';

class Notification extends React.Component{
	state = {
		user_id : '',
		notification_list : [],
	}
	componentDidMount(){
		 const user_id = localStorage.getItem('id');
		 this.setState({user_id: user_id});
		 Axios.get(API.GetAdminNotificationByUser + user_id)
		 .then(res=>{
		 	this.setState({notification_list : res.data});
		 })
		 .catch(err=>{
		 	cogoToast.error('Something went wrong!');
		 })
	}

	changeStatus=(id, status)=>{
		const {user_id} = this.state;
		const notification_id = id;
		if(status !== 'Read')
		{
		 Axios.get(API.SetReadStatus + user_id + "/" + notification_id)
		 .then(res=>{
		 		this.componentDidMount();
		 })
		 .catch(err=>{
		 	
		 })
		}

	}

	removeNotification=(id)=>{
		 Axios.get(API.DeleteNotification + id)
		 .then(res=>{
		 		this.componentDidMount();
		 })
		 .catch(err=>{
		 	
		 })
	

	}
	render(){
		const {notification_list} = this.state;
		const notification_item = notification_list.map((notification)=>{
			return (
					<div class="row m-2 animated zoomIn" onClick={this.changeStatus.bind(this, notification.notification_id, notification.status)}>
						<div class="col-md-6 offset-md-3">
							<div class="card">
								<div className={notification.status === 'Unread' || notification.status === 'Latest' ? 'unread-msg' : ''}></div>
								  <div class="card-body">
								  		<p className="text-dark">Status : {notification.status}</p>
								  		<p className="text-success">Author : {notification.author_name}</p>
									    <p className="text-danger">Title : {notification.msg_title}</p>
									    <p className="text-info">Description : {notification.msg_body}</p>
									  	<p className="text-muted">Published Date & Time : {notification.create_date} | {notification.create_time}</p>
									  	<button onClick={this.removeNotification.bind(this, notification.notification_id)} className="btn btn-sm btn-danger">Remove</button>
								    
								  </div>
							</div>
						</div>
					</div>
	

				);
		})
		return(
				<>
				<SideBar title="Change Password">
					<h2 className="text-center m-3 text-danger">All Notification From Customer</h2>
					{notification_item}
				</SideBar>
				</>
			);
	}
}
export default Notification;