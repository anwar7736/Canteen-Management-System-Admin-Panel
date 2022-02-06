class api {
	static baseURL = 'http://127.0.0.1:8000/api/';
	static login   = this.baseURL + "admin_login";
	static EmailVerification   = this.baseURL + "EmailVerification";
	static GetOTPExpiration   = this.baseURL + "GetOTPExpiration";
	static OTPVerification   = this.baseURL + "OTPVerification";
	static ResetPassword   = this.baseURL + "ResetPassword";
	static ChangePassword   = this.baseURL + "ChangePassword";
	static AllMembers   = this.baseURL + "all_members";
	static AddMember   = this.baseURL + "add_member";
	static ViewMember   = this.baseURL + "view_member_by_id/";
	static EditMember   = this.baseURL + "edit_member";
	static DeleteMember   = this.baseURL + "delete_member/";
}

export default api;