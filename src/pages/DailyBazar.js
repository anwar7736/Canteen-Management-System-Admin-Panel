import React, {Component, Fragment} from 'react';
import {Button, Card, Col, Container, Modal, Row} from "react-bootstrap";
import DataTable from "react-data-table-component";
import Axios from 'axios';
import API from './../api/api';
import cogoToast from 'cogo-toast';
import {Redirect} from 'react-router-dom';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';  
import SideBar from '../components/SideBar';


class DailyBazar extends React.Component{
        state={
            dataTable : [],
            token_no   : '',
            from_date : '',
            to_date   : '',
            show : false,
            editID : '',
            name : '',
            amount : '',
            redirectStatus : false,
            modalTitle : 'Add Bazar Cost',
            btnText : 'Save',
            redirectStatus : false,
        }

        componentDidMount=()=>{
            let user = localStorage.getItem('login');
            if(user==null)
            {
                this.setState({redirectStatus: true});
            }
             Axios.get(API.GetAllBazarCost)
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
            this.setState({modalTitle : 'Add Bazar Cost', btnText : 'Save', editID : '',  name : '', amount : ''});
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
            myData.append('from_date', from_date);
            myData.append('to_date', to_date);

          Axios.post(API.GetBazarCostByDate, myData)
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
                 Axios.get(API.DeleteDailyBazarCost + "/" + id)
                 .then(response=>{
                    if(response.status == 200 && response.data == 1)
                    {
                             this.componentDidMount();
                             cogoToast.success('Bazar cost has been deleted');
                    }
                    else{
                         cogoToast.error('Bazar cost will not be deleted!');
                    }
                     
                 })
                 .catch(error=>{
                     cogoToast.error('Something went wrong!');
                 })
    }

    editIconOnClick=(id)=>{
       this.handleOpen();
       this.setState({editID:id, modalTitle : 'Edit Bazar Cost', btnText : 'Update'})
       Axios.get(API.GetBazarCostById + "/" + id)
                 .then(response=>{
                         this.setState({
                            name: response.data.name,
                            amount: response.data.amount,
                        })
                 })
                 .catch(error=>{
                    
                 })

    }

    onSubmitHandler=()=>{
        const {editID, name, amount} = this.state;
        if(name == "")
        {
            cogoToast.error('Name is Required!');
        }

        else if(amount == "")
        {
            cogoToast.error('Bazar Cost is Required!');
        }

        else{
          let formData = new FormData;
        formData.append("name", name);
        formData.append("amount", amount);

        if(editID == "")
        {
            Axios.post(API.AddDailyBazarCost, formData)
            .then(response=>{
                if(response.status == 200 && response.data == 1)
                {
                    this.clearForm();
                    this.handleClose();
                    cogoToast.success('New Bazar Cost Saved Successfully');
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
             formData.append("cost_id", editID);
             Axios.post(API.EditDailyBazarCost, formData)
                .then(response=>{
                    if(response.status == 200 && response.data == 1)
                    {
                        this.clearForm();
                        this.handleClose();
                        cogoToast.success('Bazar Cost Updated Successfully');
                    }

                    else{
                       cogoToast.error('Bazar cost will not be updated!');
                    }
                })
                .catch(error=>{
                     cogoToast.error('Something went wrong!');
                });
        }   
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
    const {from_date, to_date, show, name , btnText, amount, isDisabled} = this.state;
  
     const costs = [
            {
                name: 'Bazar Date',
                selector: 'date',
                sortable: true,

            },  
            {
                name: 'Year',
                selector: 'year',
                sortable: true,

            }, 
            {
                name: 'Month',
                selector: 'month',
                sortable: false,
            },
            {
                name: 'Name',
                selector: 'name',
                sortable: true,

            },
            {
                name: 'Amount',
                selector: 'amount',
                sortable: true,
            },
            {
                name: 'Delete',
                selector: 'id',
                sortable: false,
                cell: row => <button onClick={()=>{
                    if(window.confirm('Do you want to delete this bazar cost?')) 
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
            <SideBar title="Daily Bazar Cost">
 			  <div className="container-fluid animated zoomIn transaction-preview">
                   <button onClick={this.handleOpen} className="btn btn-info">Add Bazar Cost</button>
                    <h3 className="heading-title text-danger text-center m-3">All Bazar Cost Statement</h3><hr/>
                    <div className="input-group row">
                        <div className="col-md-4 ">
                          From : <input value={from_date} onChange={(e)=> {this.setState({from_date:e.target.value})}} className=" form-control form-control-sm mx-2" type="date"/>
                        </div>
                        <div className="col-md-4 ">
                          To : <input value={to_date} onChange={(e)=> {this.setState({to_date:e.target.value})}} className=" form-control form-control-sm mx-2" type="date"/>
                        </div>
                        <div className="col-md-4">
                          <button onClick={this.filterByDate} className="btn btn-sm btn-success mx-2 mt-4">Filter</button>
                          <button onClick={this.resetForm} className="btn btn-sm btn-danger mx-2 mt-4">Refresh</button>
                        </div>
                    </div>
                </div>
                <hr/>
                    <DataTable
                        noHeader={true}
                        paginationPerPage={5}
                        pagination={true}
                        columns={costs}
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
                        <label className="form-label"><b>Name</b></label>
                        <input value={name} onChange={(e)=> {this.setState({name:e.target.value})}} className="form-control form-control-sm" type="text" placeholder="Enter name..."/><br/>
                             <label className="form-label"><b>Total Bazar Cost</b></label>
                        <input value={amount} onChange={(e)=> {this.setState({amount:e.target.value})}} className="form-control form-control-sm" type="text" placeholder="Enter amount..."/><br/>
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
export default DailyBazar;