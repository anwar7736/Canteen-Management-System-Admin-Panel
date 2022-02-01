import React, {Component, Fragment} from 'react';
import Loading from '../components/loadingDiv';
import Error from '../components/wentWrong';
import {Button, Container} from 'react-bootstrap';
import SideBar from '../components/SideBar';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory from 'react-bootstrap-table2-editor';
import swal from 'sweetalert';
import { ToastContainer, toast } from 'react-toastify';
import Axios from 'axios';
import cogoToast from 'cogo-toast';
import {Redirect} from 'react-router';

class ContactPage extends Component {
	constructor(){
		super()
		this.state = {
			Data : [],
			isLoading : true,
			isError : false,
			deleteID : '',
			redirectStatus : false,
		}
	}
	componentDidMount(){
		let user = localStorage.getItem('login');
        if(user==null)
        {
            this.setState({redirectStatus: true});
        }

		Axios.get('/ContactList')
		.then(response=>{
			 if(response.status==200){
               	 this.setState({Data : response.data, isLoading:false});
            }
            else{
                this.setState({isLoading:false,isError:true})
            }
		})
		.catch(error=>{
			this.setState({isLoading:false, isError:true});
		})
	}
	onClick=()=>{
		if(this.state.deleteID===''){
			toast.warn('Please select any row!');
		}else{
			if(window.confirm('Do you want to delete this data?')){
			Axios.post('/ContactDelete', {id: this.state.deleteID})
			.then(response=>{
					if(response.status==200 & response.data==1)
					{
						toast.success('Delete has been deleted', {
                        position: "bottom-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: 0,
                    });
						this.componentDidMount();
						this.setState({deleteID:''})
					}
					else{
						toast.error('Delete Failed', {
                        position: "bottom-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: 0,
                    });
					}
					
			})
			.catch(error=>{
						toast.error('Something went wrong!', {
                        position: "bottom-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: 0,
                    });
			})
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
    render() {
    	if(this.state.isLoading==true && this.state.isError==false)
        {
            return (
                    <SideBar title="Contact">   
                        <Container>
                            <Loading/>
                        </Container>
                    </SideBar>
                )
        }
        else if(this.state.isError==true && this.state.isLoading==false)
        {
              return (
                    <SideBar title="Contact">   
                        <Container>
                            <Error/>
                        </Container>
                    </SideBar>
                )
        }
        else{
		const allData = this.state.Data;
		const columns = [
		{dataField: 'id',text: 'ID',sort:true},  
		{dataField: 'name',text: 'Name',sort:true}, 
		{dataField: 'email',text: 'Email'},
		{dataField: 'message',text: 'Message'}
		];
		const selectRow = {
		  mode: 'radio',
		  onSelect:(row, isSelect, rowIndex)=>{ 
		  	this.setState({deleteID : row['id']})
		  }
		  
		};

        return (
            <Fragment>
                <SideBar title="Contact">
                	<Button onClick={this.onClick} variant="danger" className="btn-sm mb-2">Delete</Button>
                	<BootstrapTable 
                		keyField='id' 
                		data={ allData } 
                		columns={ columns } 
                		pagination={ paginationFactory() } 
                		selectRow={ selectRow }

                	/>
                </SideBar>
				{this.RedirectToLogin()}
            </Fragment>
        );
    	}
     }
    
}

export default ContactPage;
