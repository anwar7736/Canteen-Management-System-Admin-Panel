import React, {Component, Fragment} from 'react';
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
class CustomerPage extends Component {
	constructor(){
		super()
		this.state = {
			Data : [],
            action : '',
            name : '',
            username : '',
            password : '',
            email : '',
            phone : '',
            role : 'user',
            status : 'active',
            address : '',
            picture : '',
            token_no : '',
            selectedID : '',
			addNewModal : false,          
            headerTitle : '',
            submitBtnText : '',
            isDisabled : true,
            previewImg : '',
            redirectStatus : false,
            mainDiv : '',
            token_view : 'd-none',
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
            name : '',
            username : '',
            email : '',
            phone : '',
            password : '',
            photo : '',
            previewImg : '',
            address : '',
            status : 'active',
            role : 'user',
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
            const id = this.state.selectedID;
            Axios.get(API.ViewMember + id)
            .then(response=>{
                if(response.status==200)
                {
                    this.setState({
                        name : response.data['name'],
                        username : response.data['username'],
                        password : response.data['password'],
                        email : response.data['email'],
                        phone : response.data['phone'],
                        address : response.data['address'],
                        photo : response.data['photo'],
                        status : response.data['status'],
                        role : response.data['role'],
                        token_no : response.data['token_no'],

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
        const {action, name, username, password, token_no, email, phone, role, status, address, picture, previewImg} = this.state;
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
            let myFormData = new FormData();
            myFormData.append('name', name);
            myFormData.append('username', username);
            myFormData.append('password', password);
            myFormData.append('email', email);
            myFormData.append('phone', phone);
            myFormData.append('photo', picture);
            myFormData.append('address', address);
            myFormData.append('role', role);
            myFormData.append('status', status);
            Axios.post(API.AddMember,myFormData)
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
                                cogoToast.success('Member has been inserted');

                            },1000);

                        }
                         else{
                          this.setState({submitBtnText:'Submit'});
                          cogoToast.error('Something went wrong!');
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
     const id = this.state.selectedID;
    let myFormData = new FormData();
        myFormData.append('id', id);
        myFormData.append('name', name);
        myFormData.append('username', username);
        myFormData.append('password', password);
        myFormData.append('email', email);
        myFormData.append('phone', phone);
        myFormData.append('photo', picture);
        myFormData.append('address', address);
        myFormData.append('role', role);
        myFormData.append('status', status);
        myFormData.append('token_no', token_no);

    Axios.post(API.EditMember,myFormData)
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
                        cogoToast.success('Member has been updated');

                    },1000);

                }
                else
                {
                        setTimeout(()=>{
                        this.setState({submitBtnText:'Update'});
                        cogoToast.info(response.data);

                    },1000);

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
	onDelete=()=>{
        const id = this.state.selectedID;
		if(id!==null){
			if(window.confirm('Do you want to delete this member?')){
			Axios.get(API.DeleteMember + id)
			.then(response=>{
					cogoToast.success('Member has been deleted');
					this.componentDidMount();
					this.setState({selectedID:''})
			})
			.catch(error=>{
				cogoToast.error('Something went wrong!');
			})
	}
	}

	}

    printToken=(id)=>{
        Axios.get(API.GetUserProfile + id)
        .then(response=>{
            if(response.status==200)
            {
                this.setState({
                    name : response.data['name'],
                    token_no : response.data['token_no'],
                    email : response.data['email'],
                    phone : response.data['phone'],
                    previewImg : response.data['photo'],
                    reg_date : response.data['reg_date']

                })

            }
        })
        .catch(error=>{

        })
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
    print=()=>{
        this.setState({mainDiv : 'd-none', token_view : ''});
        window.print();
        this.setState({mainDiv : '', token_view : 'd-none'});
    }
    render() {

		const allData = this.state.Data;
        const {name, mainDiv, token_view, reg_date, username, password, token_no, email, phone, role, status, address, photo, previewImg} = this.state;
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
            this.printToken(row['id']);
		  }
		  
		};

        return (
            <Fragment>
                <SideBar title="Customer">
                    <div className={mainDiv + " animated zoomIn"}>
                        <h2 className="text-center text-danger">All Customer List</h2>
                        <Button onClick={this.modalOpen.bind(this, 'Insert')} variant="success" className="btn-sm m-1">Add</Button>
                        <Button onClick={this.modalOpen.bind(this, 'Update')} variant="info" className="btn-sm m-1" disabled={this.state.isDisabled}>Edit</Button>
                        <Button onClick={this.onDelete} variant="danger" className="btn-sm m-1" disabled={this.state.isDisabled}>Delete</Button>
                        <Button onClick={this.print} variant="primary" className="btn-sm m-1" disabled={this.state.isDisabled}>Print Token</Button><br/><br/>
                        <BootstrapTable 
                            keyField='id' 
                            data={ allData } 
                            columns={ columns } 
                            pagination={ paginationFactory() } 
                            selectRow={ selectRow } /> 
                   
                    </div>
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
                                <Form.Group className={previewImg}>
                                    <Form.Label>Token No. </Form.Label>
                                    <Form.Control value={token_no} onChange={(e)=>this.setState({token_no : e.target.value})} type="text" placeholder="Member Token No...." />
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
                                     <select value={role} onChange={(e)=>this.setState({role : e.target.value})} className="form-control">
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                     </select>
                                </Form.Group> 
                                <Form.Group >
                                    <Form.Label>Status</Form.Label>
                                    <select value={status} onChange={(e)=>this.setState({status : e.target.value})} className="form-control">
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
                                    <img className={previewImg + " mt-3"} src={photo} width="100" height="100"/>
                                </Form.Group>

                                <Button className="btn form-control mt-4" variant="info" type="submit">
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
                     <div className={token_view + " container token_preview card mt-4 col-lg-4 col-md-5 col-sm-8 col-xs-8"}>
                        <div className="token_section">
                            <h3 className="text-success text-center m-3"><b>CANTEEN <br/>MANAGEMENT SYSTEM</b></h3><hr/>
                            <img src={previewImg} className="prevIMG"/>
                            <hr/>
                                <h5 className=""><b className="text-muted">Name :</b> <span className="text-muted">{name}</span></h5>
                                <h5 className=""><b className="text-muted">Email :</b> <span className="text-muted">{email}</span></h5>
                                <h5 className=""><b className="text-muted">Phone :</b> <span className="text-muted">{phone}</span></h5>
                                <h5 className=""><b className="text-muted">Reg Date :</b> <span className="text-muted">{reg_date}</span></h5><hr/>
                            <h2 className="text-danger text-center"><b>TOKEN NO : {token_no}</b></h2>
                        </div>
                     </div>
                {this.RedirectToLogin()}
            </Fragment>
        );
        
     }
    
}

export default CustomerPage;
