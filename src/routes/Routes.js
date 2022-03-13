import React, {Component, Fragment} from 'react';
import {Route, Switch} from 'react-router-dom';
import Home from '../pages/HomePage';
import Login from '../pages/LoginPage';
import EmailVerify from '../pages/EmailVerify';
import OTPVerify from '../pages/OTPVerify';
import ForgetPassword from '../pages/ForgetPassword';
import ChangePassword from '../pages/ChangePassword';
import MemberPage from '../pages/MemberPage';
import DailyMealItem from '../pages/DailyMealItem';
import SendNotification from '../pages/SendNotification';
import OrderDailyMeal from '../pages/OrderDailyMeal';
import Payment from '../pages/Payment';
import Notification from '../pages/Notification';
import DayWiseMeal from '../pages/DayWiseMeal';
import DailyBazar from '../pages/DailyBazar';


import NotFound from '../pages/NotFound';

class Routes extends Component {
    render() {
        return (
            <Fragment>
            <Switch>
                <Route exact path="/" render={(props)=> <Home {...props} key={ Date.now() } />} />
                <Route exact path="/admin_login" render={(props)=> <Login {...props} key={ Date.now() } />} />
                <Route exact path="/email_verification" render={(props)=> <EmailVerify {...props} key={ Date.now() } />} />
                <Route exact path="/otp_verification" render={(props)=> <OTPVerify {...props} key={ Date.now() } />} />
                <Route exact path="/forget_password" render={(props)=> <ForgetPassword {...props} key={ Date.now() } />} />
                <Route exact path="/changePassword" render={(props)=> <ChangePassword {...props} key={ Date.now() } />} />
                <Route exact path="/member" render={(props)=> <MemberPage {...props} key={ Date.now() } />} />
                <Route exact path="/daily_meal_item" render={(props)=> <DailyMealItem {...props} key={ Date.now() } />} />
                <Route exact path="/send_notification" render={(props)=> <SendNotification {...props} key={ Date.now() } />} />
                <Route exact path="/order_daily_meal" render={(props)=> <OrderDailyMeal {...props} key={ Date.now() } />} />
                <Route exact path="/day_wise_meal_report" render={(props)=> <DayWiseMeal {...props} key={ Date.now() } />} />
                <Route exact path="/make_payment" render={(props)=> <Payment {...props} key={ Date.now() } />} />
                <Route exact path="/notification" render={(props)=> <Notification {...props} key={ Date.now() } />} />
                <Route exact path="/daily_bazar_cost" render={(props)=> <DailyBazar {...props} key={ Date.now() } />} />
               	



                <Route exact component={NotFound}/>
            </Switch>
            </Fragment>
        );
    }
}

export default Routes;
