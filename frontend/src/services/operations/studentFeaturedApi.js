import { studentEndpoints } from "../apis";
import {toast} from 'react-hot-toast'

const {COURSE_PAYMENT_API,COURSE_VERIFY_API,SEND_PAYMENT_SUCCESS_EMAIL_API} = studentEndpoints;

function loadScript(src){
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true);
        }
        script.onerror=() => {
            resolve(false)
        }
        document.body.appendChild(script);
    })
}

export async function buyCourse(params) {
    const toastId = toast.loading("Loading...");
    try {
        // load the script 
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if(!res){
            toast.error("RazorPay SDK failed to load");
            return ;
        }

        // initiate the order 
        const orderResponse = await apiConnector("POST",COURSE_PAYMENT_API,{courses},{
            Authorization : `Bearer ${token}`
        })

        if(!orderResponse.data.success){
            throw new Error(orderResponse.data.message);
        }

        // // options 
        // const options = 
    } catch (error) {
        
    }
}