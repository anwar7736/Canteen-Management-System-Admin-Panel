import React, {Component, Fragment} from 'react';
import {Button, Card, Col, Container, Modal, Row} from "react-bootstrap";
import DataTable from "react-data-table-component";
import Axios from 'axios';
import API from './../api/api';
import cogoToast from 'cogo-toast';
import {Redirect} from 'react-router-dom';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';  
import SideBar from '../components/SideBar';


class Payment extends React.Component{
        state={
            dataTable : [],
            token_no   : '',
            from_date : '',
            to_date   : '',
            show : false,
            editID : '',
            token_no : '',
            selected_month : '',
            selected_year : '',
            payment_status : '',
            amount : '',
            redirectStatus : false,
            modalTitle : 'Make New Payment',
            btnText : 'Save',
            redirectStatus : false,
        }

        componentDidMount=()=>{
            let user = localStorage.getItem('login');
            if(user==null)
            {
                this.setState({redirectStatus: true});
            }
             Axios.get(API.GetAllPayments)
             .then(response=>{
                 this.setState({dataTable : response.data});

             })
             .catch(error=>{
               
             })
     }

       resetForm=()=>{
            this.setState({from_date : '', to_date : ''});
            this.componentDidMount();
        }

        clearForm=()=>{
            this.setState({token_no : '', editID : '', selected_year : '', selected_month : '', payment_status : '', amount : ''});
            this.componentDidMount();
        }
     
      filterByDate=()=>{
           const {token_no, from_date, to_date} = this.state;

           if(from_date=='' || to_date=='')
           {
             cogoToast.warn('Both dates are required!');
           }
           else{
                let myData = new FormData();
                myData.append('token_no', token_no);
                myData.append('from_date', from_date);
                myData.append('to_date', to_date);

              Axios.post(API.PaymentDetailsFilterByDate, myData)
             .then(response=>{
                 this.setState({dataTable : response.data});
             })
             .catch(error=>{
                cogoToast.error('Something went wrong!');
             })
           }
         } 


      filterByDate=()=>{
       const {token_no, from_date, to_date} = this.state;

       if(from_date=='' || to_date=='')
       {
         cogoToast.warn('Both dates are required!');
       }
       else{
            let myData = new FormData();
            myData.append('from_date', from_date);
            myData.append('to_date', to_date);

          Axios.post(API.GetAllPaymentByDate, myData)
         .then(response=>{
             this.setState({dataTable : response.data});
         })
         .catch(error=>{
           
         })
       }
     } 

    handleClose=()=>{
        this.setState({show:false});
        this.clearForm();
    }

    handleOpen=()=>{
        this.setState({ show:true});
    }

    deleteIconOnClick=(id)=>{
                 Axios.get(API.DeletePayment + id)
                 .then(response=>{
                    if(response.status == 200 && response.data == 1)
                    {
                             this.componentDidMount();
                             cogoToast.success('Payment has been deleted');
                    }
                    else{
                         cogoToast.error('Something went wrong!');
                    }
                     
                 })
                 .catch(error=>{
                     cogoToast.error('Something went wrong!');
                 })
    }

    editIconOnClick=(id)=>{
       this.handleOpen();
       this.setState({editID:id, modalTitle : 'Edit Payment', btnText : 'Update'})
       Axios.get(API.GetPaymentById + id)
                 .then(response=>{
                         this.setState({
                            token_no: response.data.token_no,
                            selected_year: response.data.year,
                            selected_month: response.data.month,
                            payment_status: response.data.status,
                            amount: response.data.amount,
                        })
                 })
                 .catch(error=>{
                    
                 })

    }

    onSubmitHandler=()=>{
        const {token_no, editID, selected_year, selected_month, payment_status, amount} = this.state;
        if(token_no == "")
        {
            cogoToast.error('Token No is Required!');
        }

        else if(selected_year == "")
        {
            cogoToast.error('Payment Year is Required!');
        }

        else if(selected_month == "")
        {
            cogoToast.error('Payment Month is Required!');
        }

        else if(payment_status == "")
        {
            cogoToast.error('Payment Status is Required!');
        }

        let formData = new FormData;
        formData.append("token_no", token_no);
        formData.append("year", selected_year);
        formData.append("month", selected_month);
        formData.append("status", payment_status);
        formData.append("amount", amount);

        if(editID == "")
        {
            Axios.post(API.AddPayment, formData)
            .then(response=>{
                if(response.status == 200 && response.data == 1)
                {
                    this.clearForm();
                    this.handleClose();
                    cogoToast.success('New Payment Saved Successfully');
                }

                else{
                    cogoToast.error('Something went wrong!');
                }
            })
            .catch(error=>{
                 cogoToast.error('Something went wrong!');
            })
        }

        else {
             formData.append("payment_id", editID);
             Axios.post(API.EditPayment, formData)
                .then(response=>{
                    if(response.status == 200 && response.data == 1)
                    {
                        this.clearForm();
                        this.handleClose();
                        cogoToast.success('Payment Updated Successfully');
                    }

                    else{
                        cogoToast.error('Something went wrong!');
                    }
                })
                .catch(error=>{
                     cogoToast.error('Something went wrong!');
                });
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

 render(){
    const {from_date, to_date, show, token_no , btnText, amount, selected_year, selected_month, payment_status} = this.state;
    const years = ["2022", "2021", "2020", "2019", "2018"];
    const  months = ["January", "February", "March",
                    "April", "May", "June",
                     "July", "August", "September",
                     "October", "November", "December"];

     const payments = [
            {
                name: 'Payment Date',
                selector: 'payment_date',
                sortable: true,

            },  
            {
                name: 'Payment Time',
                selector: 'payment_time',
                sortable: true,

            }, 
            {
                name: 'Token No',
                selector: 'token_no',
                sortable: false,
            },
            {
                name: 'Name',
                selector: 'name',
                sortable: true,

            },
            {
                name: 'Phone',
                selector: 'phone',
                sortable: true,

            },
            {
                name: 'Amount',
                selector: 'amount',
                sortable: true,
            },
            {
                name: 'TrxID',
                selector: 'transaction_id',
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
            <SideBar title="Make Payment">
 			  <div className="container-fluid animated zoomIn transaction-preview">
                   <button onClick={this.handleOpen} className="btn btn-info">Add New Payment</button>
                    <h3 className="heading-title text-danger text-center m-3">All Payment Details</h3><hr/>
                    <div className="input-group">
                        From : <input value={from_date} onChange={(e)=> {this.setState({from_date:e.target.value})}} className="w-25 form-control form-control-sm mx-2" type="date"/>
                        To : <input value={to_date} onChange={(e)=> {this.setState({to_date:e.target.value})}} className="w-25 form-control form-control-sm mx-2" type="date"/>
                        <button onClick={this.filterByDate} className="btn btn-sm btn-success mx-2">Filter</button>
                        <button onClick={this.resetForm} className="btn btn-sm btn-danger mx-2">Refresh</button>
                    </div>
                </div>
                <hr/>
                    <DataTable
                        noHeader={true}
                        paginationPerPage={5}
                        pagination={true}
                        columns={payments}
                        data={this.state.dataTable}
                    />
                <br/>
                <br/>
                <br/>
            </SideBar>
            <Modal scrollable={true} animation={false} className="animated zoomIn" show={show} onHide={show}>
                    <Modal.Header>
                        <strong><p className="text-danger">{this.state.modalTitle}</p></strong>
                    </Modal.Header>
                    <Modal.Body>
                        <label className="form-label"><b>Token No</b></label>
                        <input value={token_no} onChange={(e)=> {this.setState({token_no:e.target.value})}} className="form-control form-control-sm" type="text"/><br/>
                              <label className="form-label"><b>Payment Year</b></label> <select value={selected_year} className="form-control" onChange={(e)=> this.setState({selected_year : e.target.value})}>
                                <option value="" selected disabled>Choose Year</option>
                                {
                                    years.map((year)=>{
                                        return (<option value={year}>{year}</option>);
                                    })
                                }
                            </select><br/>
                            <label className="form-label"><b>Payment Month</b></label> <select value={selected_month} className="form-control" onChange={(e)=> this.setState({selected_month : e.target.value})}>
                                <option value="" selected disabled>Choose Month</option>
                                {
                                    months.map((month)=>{
                                        return (<option value={month}>{month}</option>);
                                    })
                                }
                            </select><br/>
                            <label className="form-label"><b>Payment Status</b></label> <select value={payment_status} className="form-control" onChange={(e)=> this.setState({payment_status : e.target.value})}>
                                <option value="" selected disabled>Choose Payment Status</option>
                                
                                    
                                        <option value="Completed">Completed</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Pending">Pending</option>
                                
                                
                            </select><br/>
                             <label className="form-label"><b>Pay Amount</b></label>
                        <input value={amount} onChange={(e)=> {this.setState({amount:e.target.value})}} className="form-control form-control-sm" type="text"/><br/>
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
          {this.RedirectToLogin()}
 		</Fragment>
 		)
 }
}
export default Payment;