class api {
	static baseURL = 'http://127.0.0.1:8000/api/';
	static login   = this.baseURL + "admin_login";
	static EmailVerification   = this.baseURL + "EmailVerification";
	static GetOTPExpiration   = this.baseURL + "GetOTPExpiration";
	static OTPVerification   = this.baseURL + "OTPVerification";
	static ResetPassword   = this.baseURL + "ResetPassword";
	static ChangePassword   = this.baseURL + "ChangePassword";
	static AllMembers   = this.baseURL + "all_members";
}

export default api;