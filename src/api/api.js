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
	static GetDailyMealItem   = this.baseURL + "GetDailyMealItem";
	static GetMealRate   = this.baseURL + "GetMealRate";
	static ChangeMealRate   = this.baseURL + "ChangeMealRate";
	static DayWiseMealItemById   = this.baseURL + "DayWiseMealItemById/";
	static EditDayWiseMealItem   = this.baseURL + "EditDayWiseMealItem";
    static OrderDailyMeal  = this.baseURL + "OrderDailyMeal";
	static GetTodayAllOrderInfo  = this.baseURL + "GetTodayAllOrderInfo";
	static GetTodayOrderInfoByOrderId  = this.baseURL + "GetTodayOrderInfoByOrderId/";
	static ChangeOrderedMeal  = this.baseURL + "ChangeOrderedMeal";
	static DeleteTodayOrder  = this.baseURL + "DeleteTodayOrderedMeal/";
	static RestoreTodayOrder  = this.baseURL + "RestoreTodayOrderedMeal/";
	static SendMessage   = this.baseURL + "SendMessage";
	static SendEmailNotification   = this.baseURL + "SendEmailNotification";

}

export default api;