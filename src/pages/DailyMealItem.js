import React, {Component, Fragment} from 'react';
import {Button, Card, Col, Container, Modal, Row} from "react-bootstrap";
import cogoToast from 'cogo-toast';
import API from './../api/api';
import {Redirect} from 'react-router-dom';
import {Link} from "react-router-dom";
import Axios from 'axios';
import SideBar from '../components/SideBar';

class DailyMealItem extends React.Component{
	state = {
		data : [],
		btnText: 'Edit',
		show : false,
		lunch_expiry_time : '',
		dinner_expiry_time : '',
		lunch_rate : '',
		lunch_rate_bangla : '',
		dinner_rate : '',
		dinner_rate_bangla : '',
		meal_rate_id : '',
		id : '',
		showMeal : '',
		lunch_item : '',
		dinner_item : '',
		item_id : '',
		redirectStatus : false,
	}
	componentDidMount(){
		let user = localStorage.getItem('login');
        if(user==null)
        {
            this.setState({redirectStatus: true});
        }

		Axios.get(API.GetDailyMealItem)
		.then(res=>{
			if(res.status==200 && res.data!=0)
			{
				this.setState({data: res.data});
			}
			
		})
		.catch(err=>{
			
		});

		Axios.get(API.GetMealRate)
		.then(res=>{
			if(res.status==200 && res.data!=0)
			{
				this.setState({
					lunch_expiry_time: res.data[0].lunch_expiry_time,
					dinner_expiry_time: res.data[0].dinner_expiry_time,
					lunch_rate: res.data[0].lunch_rate,
					lunch_rate_bangla: res.data[0].lunch_rate_bangla,
					dinner_rate: res.data[0].dinner_rate,
					dinner_rate_bangla: res.data[0].dinner_rate_bangla,
					meal_rate_id : res.data[0].id,
				});
			}
			
		})
		.catch(err=>{
			
		});
	}

	onMealEdit=()=>{
		const {lunch_expiry_time,dinner_expiry_time,lunch_rate, lunch_rate_bangla, dinner_rate, dinner_rate_bangla, meal_rate_id} = this.state;
		if(lunch_expiry_time=="")
		{
			cogoToast.info('দুপুরের সময় নির্বাচন করুন!');
		}
		else if(dinner_expiry_time=="")
		{
			cogoToast.info('রাতের সময় নির্বাচন করুন!');
		}
		else if(lunch_rate=="" || lunch_rate_bangla=="")
		{
			cogoToast.info('দুপুরের খাবারের মূল্য নির্ধারণ করুন!');
		}
		else if(dinner_rate=="" || dinner_rate_bangla=="")
		{
			cogoToast.info('রাতের খাবারের মূল্য নির্ধারণ করুন!');
		}
		else{
			let myForm = new FormData();
			myForm.append('id', meal_rate_id);
			myForm.append('lunch_expiry_time', lunch_expiry_time);
			myForm.append('dinner_expiry_time', dinner_expiry_time);
			myForm.append('lunch_rate', lunch_rate);
			myForm.append('lunch_rate_bangla', lunch_rate_bangla);
			myForm.append('dinner_rate', dinner_rate);
			myForm.append('dinner_rate_bangla', dinner_rate_bangla);
			Axios.post(API.ChangeMealRate, myForm)
			.then(res=>{
				if(res.status==200 && res.data==1)
				{
					this.componentDidMount();
					cogoToast.success('মিল রেট পরিবর্তন করা হয়ে গেছে');
					this.handleClose();
				}
				else {
					cogoToast.error('দুঃখিত! আবার চেষ্টা করুন');
				}
			})
			.catch(err=>{
				cogoToast.error('দুঃখিত! আবার চেষ্টা করুন');
			})
		}
	}   
	onEditMealItem=()=>{
		const {item_id, lunch_item, dinner_item} = this.state;
		if(lunch_item == "")
		{
			cogoToast.error('দুপুরের খাবারের মেন্যু নির্বাচন করুন');
		}

	    else if(dinner_item == "")
		{
			cogoToast.error('রাতের খাবারের মেন্যু নির্বাচন করুন');

		}

		else {
			let mealItem = new FormData();
			mealItem.append('item_id', item_id);
			mealItem.append('lunch_item', lunch_item);
			mealItem.append('dinner_item', dinner_item);
			Axios.post(API.EditDayWiseMealItem, mealItem)
			.then(res=>{
				if(res.status==200 && res.data==1)
				{
					this.componentDidMount();
					cogoToast.success('খাবারের মেন্যু পরিবর্তন করা হয়ে গেছে');
					this.handleItemClose();
				}
				else {
					cogoToast.error('দুঃখিত! আবার চেষ্টা করুন');
				}
			}).catch(err=>{
				cogoToast.error('দুঃখিত! আবার চেষ্টা করুন');
			})
		}
	}

	handleClose=()=>{
        this.setState({show:false});
    }

    handleOpen=()=>{
        this.setState({ show:true});
    }

    handleItemOpen=(item_id)=>{
        this.setState({ showMeal:true, item_id});
        Axios.get(API.DayWiseMealItemById + item_id)
        .then(res=>{
        	this.setState({
        		day : res.data[0].day,
        		lunch_item : res.data[0].lunch_item, 
        		dinner_item : res.data[0].dinner_item,
        	});
        }).catch(err=>{

        })
    }

    handleItemClose=()=>{
        this.setState({ showMeal:false});
    }

   RedirectToLogin=()=>{
        if(this.state.redirectStatus===true)
        {
            return(
                <Redirect to="/admin_login" />
            )
        }
    }

 render(){
 	const {data,btnText,show,lunch_expiry_time,dinner_expiry_time,lunch_rate, lunch_rate_bangla, dinner_rate, dinner_rate_bangla,showMeal, lunch_item, dinner_item, day} = this.state;
 	let serial = 1;
 	const DailyMealItem = data.map(function(item){
 		return (
 			<>
 				<tr>
 					<td>{serial++}</td>
	 				<td>{item.day}</td>
	 				<td>{item.lunch_item}</td>
	 				<td>{item.dinner_item}</td>
	 				<td><button onClick={()=>this.handleItemOpen(item.id)} className="btn btn-success btn-sm">পরিবর্তন</button></td>
	 			</tr>
 			</>
 		)
 	},this)
 	return(
 		<Fragment>
 		<SideBar title="Day Wise Meal Item">
 			<div className="mt-3 animated zoomIn" style={{marginBottom:'100px'}}>
 					<center>
	 					<h6 className="text-muted">দুপুরের খাবার গ্রহণের শেষ সময়ঃ <span className="text-danger">{lunch_expiry_time}</span></h6><br/>
	 					<h6 className="text-muted">রাতের খাবার গ্রহণের শেষ সময়ঃ <span className="text-success">{dinner_expiry_time}</span></h6><br/>
	 					<h6 className="text-muted">দুপুরের খাবারের মূল্যঃ <span className="text-danger">{lunch_rate_bangla}</span></h6><br/>
	 					<h6 className="text-muted">রাতের খাবারের মূল্যঃ <span className="text-success">{dinner_rate_bangla}</span></h6><br/>
	 					<button className="btn btn-info btn-sm" onClick={this.handleOpen}>মিল রেট পরিবর্তন করুন</button>
 					</center>
 					<h4 className="text-center text-danger mt-4">প্রতিদিনের খাবারের মেন্যুসমূহ নিচে দেওয়া হলঃ-</h4><br/>
 					<div class="table-responsive col-md-10 offset-md-1 text-center">
 						<table class="table table-bordered table-striped">
					  <thead style={{fontSize:'13.5px'}} className="bg-dark text-white">
					    <tr>
					      <th scope="col">সিরিয়াল</th>
					      <th scope="col">বার</th>
					      <th scope="col">দুপুরের মেন্যু </th>
					      <th scope="col">রাতের মেন্যু
					      </th><th scope="col">একশন
					      </th>
					    </tr>
					  </thead>
					  <tbody style={{fontSize:'13.5px'}}>
					    	{DailyMealItem}
					  </tbody>
					</table>
 					</div>
 			</div>
 		</SideBar>
 		<Modal scrollable={true} animation={false} className="animated zoomIn" show={show} onHide={show}>
                    <Modal.Header>
                        <strong><p className="text-danger">মিলের সময়সীমা এবং মূল্য পরিবর্তন করুন</p></strong>
                    </Modal.Header>
                    <Modal.Body>
                        <label className="form-label"><b>দুপুরের খাবারের শেষ সময়ঃ </b></label>
                        <input value={lunch_expiry_time} onChange={(e)=>this.setState({lunch_expiry_time:e.target.value})} className="form-control form-control-sm" type="text"/><br/> 
                        <label className="form-label"><b>রাতের খাবারের শেষ সময়ঃ</b></label>
                        <input value={dinner_expiry_time} onChange={(e)=>this.setState({dinner_expiry_time:e.target.value})} className="form-control form-control-sm" type="text"/><br/> 
                         <label className="form-label"><b>দুপুরের খাবারের মূল্যঃ</b></label>
                        <input value={lunch_rate} onChange={(e)=>this.setState({lunch_rate:e.target.value})} className="form-control form-control-sm" type="text"/><br/> 
                        <label className="form-label"><b>দুপুরের খাবারের মূল্যঃ (বাংলা)</b></label>
                        <input value={lunch_rate_bangla} onChange={(e)=>this.setState({lunch_rate_bangla:e.target.value})} className="form-control form-control-sm" type="text"/><br/>
                        <label className="form-label"><b>রাতের খাবারের মূল্যঃ</b></label>
                        <input value={dinner_rate} onChange={(e)=>this.setState({dinner_rate:e.target.value})} className="form-control form-control-sm" type="text"/><br/> 
                        <label className="form-label"><b>রাতের খাবারের মূল্যঃ (বাংলা)</b></label>
                        <input value={dinner_rate_bangla} onChange={(e)=>this.setState({dinner_rate_bangla:e.target.value})} className="form-control form-control-sm" type="text"/><br/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="btn-sm btn-danger" onClick={this.handleClose}>
                            Close
                        </Button>
                        <button  className="btn btn-sm btn-success"  onClick={this.onMealEdit}>
                            {btnText}
                        </button>
                    </Modal.Footer>
            </Modal>
            <Modal scrollable={true} animation={false} className="animated zoomIn" show={showMeal} onHide={showMeal} backdrop="static">
                    <Modal.Header>
                        <strong><p className="text-danger">প্রতিদিনের খাবারের মেন্যু পরিবর্তন করুন</p></strong>
                    </Modal.Header>
                    <Modal.Body>
                        <label className="form-label"><b>বারের নামঃ</b></label>
                        <input value={day} disabled className="form-control form-control-sm" type="text"/> <br/>
                        <label className="form-label"><b>দুপুরের খাবারের মেন্যুসমূহঃ</b></label>
                        <textarea value={lunch_item} onChange={(e)=>this.setState({lunch_item:e.target.value})} className="form-control form-control-sm" type="text"/><br/>
                         <label className="form-label"><b>রাতের খাবারের মেন্যুসমূহঃ</b></label>
                        <textarea value={dinner_item} onChange={(e)=>this.setState({dinner_item:e.target.value})} className="form-control form-control-sm" type="text"/><br/> 
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="btn-sm btn-danger" onClick={this.handleItemClose}>
                            Close
                        </Button>
                        <button  className="btn btn-sm btn-success"  onClick={this.onEditMealItem}>
                            {btnText}
                        </button>
                    </Modal.Footer>
            </Modal>
             {this.RedirectToLogin()}
 		</Fragment>
 		)
 	
 }
}
export default DailyMealItem;