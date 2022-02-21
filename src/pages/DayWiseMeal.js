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
            from_date : '',
            to_date   : '',
            token_no  : '',
        }

        componentDidMount=()=>{

         Axios.get(API.GetAllMealDetails)
         .then(response=>{
            this.setState({dataTable : response.data});

         })
         .catch(error=>{
           
         })
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

 render(){
    const {from_date, to_date, token_no} = this.state;
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
                            Token No : <input value={token_no} onChange={(e)=> {this.setState({token_no:e.target.value})}} className=" form-control form-control-sm mx-2" type="text"/>
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
 		</Fragment>
 		)
 }
}
export default DayWiseMeal;