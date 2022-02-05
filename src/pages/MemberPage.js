import React, {Component, Fragment} from 'react';
import Loading from '../components/loadingDiv';
import Error from '../components/wentWrong';
import {Button, Modal, Form, Container} from 'react-bootstrap';
import SideBar from '../components/SideBar';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory from 'react-bootstrap-table2-editor';
import swal from 'sweetalert';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Axios from 'axios';
import cogoToast from 'cogo-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ReactHtmlParser from 'react-html-parser';
import {Redirect} from 'react-router';
import API from './../api/api';
class MemberPage extends Component {
	constructor(){
		super()
		this.state = {
			Data : [],
			isLoading : true,
			isError : false,
            action : '',
            name : '',
            username : '',
            password : '',
            email : '',
            phone : '',
            role : '',
            status : '',
            address : '',
            picture : '',
            selectedID : '',
			addNewModal : false,          
            headerTitle : '',
            submitBtnText : '',
            isDisabled : true,
            previewImg : '',
            redirectStatus : false,
		}
	}
	componentDidMount(){
        let user = localStorage.getItem('login');
        if(user==null)
        {
            this.setState({redirectStatus: true});
        }

		Axios.get(API.AllMembers)
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

    resetForm=()=>{
        this.setState({
            projectName : '',
            projectDes : '',
            projectFeatures : '',
            projectLink : '',
            long_des : '',
            photoOne : '',
            photoTwo : '',
        });
    }


    modalOpen=(action)=>{
        this.setState({action});
        if(action==='Insert')
        {
            this.resetForm();
            this.setState({submitBtnText: 'Submit', headerTitle : 'Add New Member', previewImg : 'd-none'});
        }

        else if(action==='Update')
        {
            this.setState({previewImg : ''});
            Axios.get('/GetProjectById/'+this.state.selectedID)
            .then(response=>{
                if(response.status==200)
                {
                    this.setState({
                        projectName : response.data[0]['project_name'],
                        projectDes : response.data[0]['short_description'],
                        projectFeatures : response.data[0]['project_features'],
                        projectLink : response.data[0]['live_preview'],
                        long_des : response.data[0]['img_one'],
                        photoOne : response.data[0]['img_two']
                    });
                }

                else
                {

                }
            })
            .catch(error=>{

            })

            this.setState({submitBtnText: 'Update', headerTitle : 'Edit Member'}); 
	}
    this.setState({addNewModal: true});
}

	modalClose=()=>{
		this.setState({addNewModal: false});
	}

    onPhotoChange=(event)=>{
        this.setState({picture:event.target.files[0]})
    }

    SubmitForm=(event)=>{
        event.preventDefault();
        const {action, name, username, password, email, phone, role, status, address, photo, previewImg} = this.state;
        if(action==='Insert')
        {
            if(name=='')
            {
                cogoToast.warn('Name field is required!');
            }
            else if(username=='')
            {
                cogoToast.warn('Username field is required!');
            }
            else if(password=='')
            {
                cogoToast.warn('Password field is required!');
            } 
            else if(password.length < 3)
            {
                cogoToast.warn('Password is too short!');
            }
            else if(email=='')
            {
                cogoToast.warn('Email field is required!');
            }
            else if(phone=='')
            {
                cogoToast.warn('Phone field is required!');
            }
            else if(address=='')
            {
                cogoToast.warn('Address field is required!');
            }
            else{
            this.setState({submitBtnText:'Submitting...'});
            let myFormData=new FormData();
            window.alert('OK');
            let url="/AddProject";
            Axios.post(url,myFormData)
                .then(response=>{
                    if(response.status==200)
                    {
                        this.setState({submitBtnText:'Submitted'});
                        if(response.data==1)
                        {
                            setTimeout(()=>{
                                this.setState({submitBtnText:'Submit'});
                                this.resetForm();
                                this.modalClose();
                                this.componentDidMount();
                                cogoToast.success('Data has been added');

                            },1000);

                        }
                         else if(response.data!=1 && response.data!=0){
                         toast.warn(response.data, {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: true,
                            progress: 0,
                        });
                    }
                    }
                })
                .catch(error=>{
                    this.setState({submitBtnText:'Error'});
                    cogoToast.error('Something went wrong!');
                })
            }
    }

    else if(action==='Update')
    {
      if(name=='')
        {
            cogoToast.warn('Name field is required!');
        }
        else if(username=='')
        {
            cogoToast.warn('Username field is required!');
        }
        else if(password=='')
        {
            cogoToast.warn('Password field is required!');
        } 
        else if(password.length < 3)
        {
            cogoToast.warn('Password is too short!');
        }
        else if(email=='')
        {
            cogoToast.warn('Email field is required!');
        }
        else if(phone=='')
        {
            cogoToast.warn('Phone field is required!');
        }
        else if(address=='')
        {
            cogoToast.warn('Address field is required!');
        }

    else{
    this.setState({submitBtnText:'Updating...'});
    let myFormData=new FormData();

    let url="/api/onEditProject";
    Axios.post(url,myFormData)
        .then(response=>{
            if(response.status==200)
            {
                this.setState({submitBtnText:'Updated'});
                if(response.data==1)
                {
                    setTimeout(()=>{
                        this.setState({submitBtnText:'Update'});
                        this.resetForm();
                        this.modalClose();
                        this.componentDidMount();
                        cogoToast.success('Data has been updated');

                    },1000);

                }
                else if(response.data==0)
                {
                        setTimeout(()=>{
                        this.setState({submitBtnText:'Update'});
                        cogoToast.info('Data is nothing to updated');

                    },1000);

                }

                else if(response.data!=1 && response.data!=0){
                    this.setState({submitBtnText:'Update'});
                    toast.warn(response.data, {
                       position: "top-right",
                       autoClose: 3000,
                       hideProgressBar: false,
                       closeOnClick: true,
                       pauseOnHover: false,
                       draggable: true,
                       progress: 0,
                   });
               }
            }
        })
        .catch(error=>{
            this.setState({submitBtnText:'Error'});
            cogoToast.error('Something went wrong!');
        })
    }

    }
}
	onClick=()=>{
		if(this.state.selectedID!==null){
			if(window.confirm('Do you want to delete this data?')){
			Axios.post('/ProjectDelete', {id: this.state.selectedID})
			.then(response=>{
					cogoToast.success('Data has been deleted');
					this.componentDidMount();
					this.setState({selectedID:''})
			})
			.catch(error=>{
				cogoToast.error('Something went wrong!');
			})
	}
	}

	}
	imgCellFormat=(cell, rowIndex)=>{
		return <img className="table-cell-img" src={cell}/>
	}
	cellFormatter=(cell, rowIndex)=>{
		return ReactHtmlParser(cell);
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
                    <SideBar title="Projects">   
                        <Container>
                            <Loading/>
                        </Container>
                    </SideBar>
                )
        }
        else if(this.state.isError==true && this.state.isLoading==false)
        {
              return (
                    <SideBar title="Projects">   
                        <Container>
                            <Error/>
                        </Container>
                    </SideBar>
                )
        }
        else{
		const allData = this.state.Data;
        const {name, username, password, email, phone, role, status, address, photo, previewImg} = this.state;
		const columns = [
         {dataField: 'photo', text: 'Profile Picture',formatter:this.imgCellFormat},
		 {dataField: 'token_no', text: 'Token No.'},
         {dataField: 'name', text: 'Name'},
         {dataField: 'email', text: 'Email'},
         {dataField: 'phone', text: 'Phone'},
         {dataField: 'status', text: 'Status'},
		];
		const selectRow = {
		  mode: 'radio',
		  onSelect:(row, isSelect, rowIndex)=>{ 
		  	this.setState({selectedID : row['id'], isDisabled: false})
		  }
		  
		};

        return (
            <Fragment>
                <SideBar title="Projects">
                    <h2 className="text-center text-danger">All Member List</h2>
                    <Button onClick={this.modalOpen.bind(this, 'Insert')} variant="success" className="btn-sm mr-2">Add</Button>
                	<Button onClick={this.modalOpen.bind(this, 'Update')} variant="info" className="btn-sm ml-2" disabled={this.state.isDisabled}>Edit</Button>
                	<Button onClick={this.onClick} variant="danger" className="btn-sm ml-2" disabled={this.state.isDisabled}>Delete</Button><br/><br/>
                	<BootstrapTable 
                		keyField='id' 
                		data={ allData } 
                		columns={ columns } 
                		pagination={ paginationFactory() } 
                		selectRow={ selectRow }

                	/>
                </SideBar>
                <Modal scrollable={true} show={this.state.addNewModal} onHide={this.addNewModal}>
                        <Modal.Header>
                            <h5 className="text-danger">{this.state.headerTitle}</h5>
                            <a style={{textDecoration:'none', cursor:'pointer'}} title="Close" className="btn-lg" onClick={this.modalClose}>&times;</a>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={this.SubmitForm}>
                                <Form.Group >
                                    <Form.Label>Name </Form.Label>
                                    <Form.Control value={name} onChange={(e)=>this.setState({name : e.target.value})} type="text" placeholder="Member Name..." />
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control  value={username} onChange={(e)=>this.setState({username : e.target.value})} type="text" placeholder="Member Username..." />
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control  value={password} onChange={(e)=>this.setState({password : e.target.value})} type="password" placeholder="Member Password" />
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control  value={email} onChange={(e)=>this.setState({email : e.target.value})} type="email" placeholder="Member Email..." />
                                </Form.Group> 
                                <Form.Group >
                                    <Form.Label>Phone</Form.Label>
                                    <Form.Control  value={phone} onChange={(e)=>this.setState({phone : e.target.value})} type="text" placeholder="Member Phone Number..." />
                                </Form.Group> 
                                <Form.Group >
                                    <Form.Label>Role</Form.Label>
                                     <select onChange={(e)=>this.setState({role : e.target.value})} className="form-control">
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                     </select>
                                </Form.Group> 
                                <Form.Group >
                                    <Form.Label>Status</Form.Label>
                                    <select onChange={(e)=>this.setState({role : e.target.value})} className="form-control">
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                     </select>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control as="textarea" rows={2} value={address} onChange={(e)=>this.setState({address : e.target.value})}/>
                                </Form.Group>

                                <Form.Group >
                                    <Form.Label>Profile Picture</Form.Label>
                                    <Form.Control onChange={this.onPhotoChange} type="file" />
                                    <img className={previewImg + " mt-3"} src={this.state.previewImg} width="100" height="100"/>
                                </Form.Group>

                                <Button className="btn-block" variant="info" type="submit">
                                    {this.state.submitBtnText}
                                </Button>

                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" size="sm" onClick={this.modalClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                {this.RedirectToLogin()}
            </Fragment>
        );
        }
     }
    
}

export default MemberPage;
