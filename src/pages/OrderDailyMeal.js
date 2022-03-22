import React, {Component, Fragment} from 'react';
import {Button, Card, Col, Container, Modal, Row} from "react-bootstrap";
import DataTable from "react-data-table-component";
import Axios from 'axios';
import API from './../api/api';
import {Redirect} from 'react-router-dom';
import cogoToast from 'cogo-toast';
import SideBar from '../components/SideBar';


class OrderDailyMeal extends React.Component{
        state={
            dataTable : [],
            lunch : '0',
            dinner : '0',
            notes : '',
            show:false,
            deleteID:"",
            editID:"",
            user_id : "",
            token_no : "",
            modalTitle : 'Order Today Meal',
            btnText : 'Save Order',
            undoBtn : 'd-none',
            redirectStatus : false,
            yes : false,
            no  : true

        }
    componentDidMount(){
        let user = localStorage.getItem('login');
        if(user==null)
        {
            this.setState({redirectStatus: true});
        }

         Axios.get(API.GetTodayAllOrderInfo)
         .then(response=>{
            if(response.status==200)
            {
                 this.setState({dataTable : response.data});
            }
             else{
                
            }
         })
         .catch(error=>{
             this.setState({isDisabled : false});
            

         });

     }

    onSubmitHandler=()=>
    {
        const {lunch, dinner, notes, editID, yes, user_id, token_no} = this.state;
        if(token_no == '')
        {
            cogoToast.warn('Token no is required!')
        }
        else if(lunch=='0'  && dinner=='0')
        {
            cogoToast.warn('Meal quantity should be greater than 0!')
        }
        else if(editID == ''){
            let myOrder = new FormData();
            myOrder.append('token_no', token_no);
            myOrder.append('lunch', Number(lunch));
            myOrder.append('dinner', Number(dinner));
            myOrder.append('parcel', Number(yes));
            myOrder.append('notes', notes);
            console.log(myOrder);
           Axios.post(API.OrderDailyMeal, myOrder)
            .then(response=>{
                    if(response.status==200 && response.data==1)
                    {
                         this.resetForm();
                         this.handleClose();
                         cogoToast.success('Today order placed successfully');
                         this.componentDidMount();

                    }
                    else{
                          cogoToast.warn('Today order already taken!');
                    }
                 })
                 .catch(error=>{
                    cogoToast.error('Something went wrong!');
                 })
        }
        else
        {
            let editOrder = new FormData();
            editOrder.append("order_id", editID);
            editOrder.append("token_no", token_no);
            editOrder.append("lunch", Number(lunch));
            editOrder.append("dinner", Number(dinner));
            editOrder.append('parcel', Number(yes));
            editOrder.append('notes', notes);
             Axios.post(API.ChangeOrderedMeal, editOrder)
                 .then(response=>{
                    if(response.status==200 && response.data==1)
                    {
                          this.resetForm();
                         this.handleClose();
                         cogoToast.success('Today order updated successfully');
                         this.componentDidMount();

                    }
                    else{
                        this.resetForm();
                        this.handleClose();
                         cogoToast.info('Nothing to Changes');
                    }
                 })
                 .catch(error=>{

                      cogoToast.error('Something went wrong!');
                 })
        
     }
    }
    resetForm=()=>{
        this.setState({token_no: '', lunch : '0',dinner : '0', yes : false, no : true, notes : '', btnText : 'Save Order', modalTitle : 'Order Today Meal', editID : '', deleteID : ''});
    }

    handleClose=()=>{
        this.setState({show:false});
        this.resetForm();
    }

    handleOpen=()=>{
        this.setState({ show:true});
    }

    deleteIconOnClick=(id)=>{
                 localStorage.setItem('deleted_order_id', id);
                 const {token_no} = this.state;
                 Axios.get(API.DeleteTodayOrder + id)
                 .then(response=>{
                    if(response.status == 200)
                    {
                         this.setState({dataTable : [], undoBtn : ''});
                         setTimeout(()=>{
                             this.setState({undoBtn : 'd-none'});
                              localStorage.removeItem('deleted_order_id');
                             this.componentDidMount();
                         },4000);
                    }
                    else{
                         cogoToast.error('Something went wrong!');
                    }
                     
                 })
                 .catch(error=>{
                     cogoToast.error('Something went wrong!');
                 })
            }


    restoreOrder=()=>{
        const order_id = localStorage.getItem('deleted_order_id');
        Axios.get(API.RestoreTodayOrder + order_id)
                 .then(response=>{
                         //this.setState({undoBtn : 'd-none', isDisabled : true});
                         // localStorage.removeItem('deleted_order_id');
                         this.componentDidMount();
                        cogoToast.success('Your today order restored successfully');
                 })
                 .catch(error=>{
                    cogoToast.error('Something went wrong!');
                 })
    }

    editIconOnClick=(id)=>{
       this.handleOpen();
       this.setState({editID:id, modalTitle : 'Update Today Order', btnText : 'Update Order'})
       Axios.get(API.GetTodayOrderInfoByOrderId + id)
                 .then(response=>{
                         if(response.data[0].is_parcel==="Yes")
                         {
                            this.setState({yes : true, no : false});
                         }
                         else {
                             this.setState({yes : false, no : true});
                         }
                         this.setState({
                            lunch: response.data[0].lunch,
                            dinner: response.data[0].dinner,
                            notes: response.data[0].notes,
                            token_no : response.data[0].token_no,
                        })
                 })
                 .catch(error=>{
                    cogoToast.error('Something went wrong!');
                 })

    }

    RedirectToLogin=()=>{
        if(this.state.redirectStatus===true)
        {
            return(
                <Redirect to="/admin_login" />
            )
        }
    }

    parcelStatus=(status)=>{
        if(status === 'Yes')
        {
            this.setState({yes : true, no : false});
        }
        else
        {
            this.setState({yes : false, no : true});
        }
    }

 render(){
    const date = new Date();
    const {lunch, dinner, notes, btnText, dataTable, yes, no, show, name, token_no, isDisabled, undoBtn} = this.state;

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
                sortable: true,
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
                name: 'Is_Parcel',
                selector: 'is_parcel',
                sortable: true,
            }, 
            {
                name: 'Status',
                selector: 'status',
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
               <SideBar title="Order Daily Meal">
 			 <div className="container-fluid mt-3 animated zoomIn">
                                            <h3 className="text-danger text-center">Place Today Order</h3><br/>
                                           <p className= {undoBtn + " text-center text-success"} > <strong>Your today order has been deleted!</strong> <span className="text-danger" onClick={this.restoreOrder} style={{cursor:'pointer'}}>Undo</span></p>
                                            <center><button onClick={this.handleOpen} className="btn btn-info">Order Today Meal</button></center>
                                            <hr className="bg-secondary"/>
                                                <DataTable
                                                    noHeader={true}
                                                    paginationPerPage={5}
                                                    pagination={true}
                                                    columns={columns}
                                                    data={dataTable}
                                                />

                </div>
                <Modal animation={false} className="animated zoomIn" show={show} onHide={show}>
                    <Modal.Header>
                        <strong><p className="text-danger">{this.state.modalTitle}</p></strong>
                    </Modal.Header>
                    <Modal.Body>
                        <label className="form-label"><b>Your Name</b></label>
                        <input value={name} disabled className="form-control form-control-sm" type="text"/> 
                        <label className="form-label"><b>Your Token No</b></label>
                        <input value={token_no} onChange={(e)=> {this.setState({token_no:e.target.value})}} className="form-control form-control-sm" type="text"/>
                        <label className="form-label"><b>Meal Order Date</b></label>
                        <input value={order_date} disabled className="form-control form-control-sm" type="text"/><br/>
                        <label className="form-label"><b>Enter Your Meal Quantity</b></label><br/>
                        <label className="form-label"><b>Lunch</b></label><br/>
                        <input type="number" min="0" max="5" onChange={(e)=> {this.setState({lunch:e.target.value})}} value={lunch}/><br/>
                        <label className="form-label"><b>Dinner</b></label><br/>
                        <input type="number" min="0" max="5" onChange={(e)=> {this.setState({dinner:e.target.value})}} value={dinner}/><br/><br/>
                        <label className="form-label"><b>Do you want to take parcel?</b></label><br/>
                        <label><input type="radio" name="parcel" onClick={(e)=>this.parcelStatus('Yes')} checked={yes}/> Yes</label><br/>
                        <label><input type="radio" name="parcel" onClick={(e)=>this.parcelStatus('No')} checked={no}/> No</label><br/>
                        <label className="form-label mt-2"><b>Add Notes (If Any)</b></label><br/>
                        <textarea onChange={(e)=> {this.setState({notes:e.target.value})}} className="form-control" value={notes} placeholder="Enter your notes.."/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="btn-sm btn-danger" onClick={this.handleClose}>
                            Close
                        </Button>
                        <button  className="btn btn-sm btn-success"  onClick={this.onSubmitHandler}>
                            {btnText}
                        </button>
                    </Modal.Footer>
                </Modal>
           </SideBar>
           {this.RedirectToLogin()}
 		</Fragment>
 		)
 }
}
export default OrderDailyMeal;