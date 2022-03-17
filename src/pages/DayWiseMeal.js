import React, {Component, Fragment} from 'react';
import {Button, Card, Col, Container, Modal, Row} from "react-bootstrap";
import DataTable from "react-data-table-component";
import Axios from 'axios';
import API from './../api/api';
import cogoToast from 'cogo-toast';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';  
import SideBar from '../components/SideBar';

class DayWiseMeal extends React.Component{
        state={
            dataTable : [],
            user_id   : '',
            name : '',
            order_id  : '',
            from_date : '',
            to_date   : '',
            token_no  : '',
            lunch     : '',
            dinner    : '',
            notes     : '',
            show      : false,
        }

        componentDidMount=()=>{

         Axios.get(API.GetAllMealDetails)
         .then(response=>{
            this.setState({dataTable : response.data});

         })
         .catch(error=>{
           
         })
     }

    handleClose=()=>{
        this.setState({show:false, order_id : '', notes : '', lunch:'', dinner:'', order_id:'',token_no:''});
     }

    handleOpen=()=>{
        this.setState({ show:true});
    }

       resetForm=()=>{
            this.setState({from_date : '', to_date : '', token_no : ''});
            this.componentDidMount();
        }
     
      filterByDate=()=>{
           const {user_id, from_date, to_date, token_no} = this.state;

           if(from_date =='' && to_date =='' && token_no == '')
           {
             cogoToast.warn('Field must not be empty!');
           }
           else{
                let myData = new FormData();
                myData.append('token_no', token_no);
                myData.append('from_date', from_date);
                myData.append('to_date', to_date);

              Axios.post(API.GetMealByFilter, myData)
             .then(response=>{
                 this.setState({dataTable : response.data});
             })
             .catch(error=>{
                
             })
           }
         } 


       viewIconOnClick=(order_id)=>{
           this.handleOpen();
           this.setState({order_id:order_id});
           Axios.get(API.GetMealByOrderId + order_id)
                     .then(response=>{
                             this.setState({
                                name: response.data[0].name,
                                token_no: response.data[0].token_no,
                                lunch: response.data[0].lunch,
                                dinner: response.data[0].dinner,
                                notes : response.data[0].notes,
                            })
                     })
                     .catch(error=>{
                        cogoToast.error('Something went wrong!');
                     })
        }

 render(){
    const {from_date, to_date, show, lunch, dinner, notes, token_no, name} = this.state;
    const date = new Date();
 const order_date = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
    const columns = [
            {
                name: 'Meal Take Date',
                selector: 'meal_given_date',
                sortable: true,

            },
            {
                name: 'Token No',
                selector: 'token_no',
                sortable: false,
            },
            {
                name: 'Lunch',
                selector: 'lunch',
                sortable: true,
            },
            {
                name: 'Dinner',
                selector: 'dinner',
                sortable: true,
            }, 
            {
                name: 'Total Meal',
                selector: 'total_meal',
                sortable: true,
            }, 
            {
                name: 'Total Amount',
                selector: 'total_amount',
                sortable: true,
            },
            {
                name: 'View Details',
                selector: 'id',
                sortable: false,
                cell: row => <button onClick={this.viewIconOnClick.bind(this,row.id)}  className="btn btn-sm text-success"><i className="fa fa-book"/></button>
            },
        ];

 	return(
 		<Fragment>
            <SideBar title="Day Wise Meal Details">
 			  <div className="container-fluid animated zoomIn transaction-preview">
                    <h3 className="heading-title text-danger text-center m-3">Day Wise Meal Report</h3><hr/>
                    <div className="input-group row">
                       <div className="col-md-4">
                             From : <input value={from_date} onChange={(e)=> {this.setState({from_date:e.target.value})}} className=" form-control form-control-sm mx-2" type="date"/>
                            To : <input value={to_date} onChange={(e)=> {this.setState({to_date:e.target.value})}} className=" form-control form-control-sm mx-2" type="date"/>
                       </div>
                       <div className="col-md-4">
                            Token No : <input value={token_no} onChange={(e)=> {this.setState({token_no:e.target.value})}} placeholder="Token No..." className=" form-control form-control-sm mx-2" type="text"/>
                       </div>
                       <div className="col-md-6">
                            <button onClick={this.filterByDate} className="btn btn-sm btn-success m-2">Filter</button>
                            <button onClick={this.resetForm} className="btn btn-sm btn-danger m-2">Refresh</button>
                       </div>
                    </div>
                </div>
                <hr/>
                    <DataTable
                        noHeader={true}
                        paginationPerPage={5}
                        pagination={true}
                        columns={columns}
                        data={this.state.dataTable}
                    />
                <br/>
                <br/>
                <br/>
        </SideBar>
        <Modal animation={false} className="animated zoomIn" show={show} onHide={show}>
                    <Modal.Header>
                        <strong><p className="text-danger">View Order Details</p></strong>
                    </Modal.Header>
                    <Modal.Body>
                        <label className="form-label"><b>Customer Name</b></label>
                        <input value={name} disabled className="form-control form-control-sm" type="text"/> 
                        <label className="form-label "><b>Customer Token No</b></label>
                        <input value={token_no} disabled className="form-control form-control-sm" type="text"/>
                         <label className="form-label"><b>Meal Order Date</b></label>
                        <input value={order_date} disabled className="form-control form-control-sm" type="text"/><br/>
                        <label className="form-label"><b>Ordered Meal Quantity</b></label><br/>
                        <label className="form-label"><b>Lunch</b></label><br/>
                        <input type="text" disabled className="form-control" value={lunch}/><br/>
                        <label className="form-label"><b>Dinner</b></label><br/>
                        <input type="text" disabled className="form-control form-control-sm" value={dinner}/><br/><br/>
                        <label className="form-label"><b>Notes</b></label><br/>
                        <textarea value={notes} disabled className="form-control form-control-sm" placeholder="No notes are available..."/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="btn-sm btn-danger" onClick={this.handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
 		</Fragment>
 		)
 }
}
export default DayWiseMeal;