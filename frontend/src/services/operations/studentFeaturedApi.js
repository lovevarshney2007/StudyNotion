import { toast } from "react-hot-toast"
import { resetCart } from "../../slices/cartSlice"
import { setPaymentLoading } from "../../slices/courseSlice"
import { apiConnector } from "../apiConnector"
import { studentEndpoints } from "../apis"
import rzpLogo from "../../Asset/Logo/rzp_logo.png"

const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = src
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
  const toastId = toast.loading("Loading...")
  dispatch(setPaymentLoading(true))

  try {
    const sdkLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

    if (!sdkLoaded) {
      toast.error("Razorpay SDK failed to load")
      return
    }

    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      { courses },
      {
        Authorization: `Bearer ${token}`,
      }
    )

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message)
    }

    const options = {
      key: import.meta.env.VITE_APP_RAZORPAY_KEY,
      currency: orderResponse.data.data.currency,
      amount: `${orderResponse.data.data.amount}`,
      order_id: orderResponse.data.data.id,
      name: "StudyNotion",
      description: "Thank you for purchasing the course",
      image: rzpLogo,
      prefill: {
        name: `${userDetails.firstName} ${userDetails.lastName || ""}`.trim(),
        email: userDetails.email,
      },
      handler: async function (response) {
        await sendPaymentSuccessEmail(
          response,
          orderResponse.data.data.amount,
          token
        )
        await verifyPayment({ ...response, courses }, token, navigate, dispatch)
      },
    }

    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
    paymentObject.on("payment.failed", function () {
      toast.error("Could not complete payment")
    })
  } catch (error) {
    console.log("Payment error ....", error)
    toast.error(error.response?.data?.message || "Could not make payment")
  } finally {
    toast.dismiss(toastId)
    dispatch(setPaymentLoading(false))
  }
}

async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )
  } catch (error) {
    console.log("Payment Success Email Error...", error)
  }
}

async function verifyPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying payment...")
  dispatch(setPaymentLoading(true))
  try {
    const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
      Authorization: `Bearer ${token}`,
    })

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Payment successful, you are added to the course")
    dispatch(resetCart())
    navigate("/dashboard/enrolled-courses")
  } catch (error) {
    console.log("Payment Verify Error...", error)
    toast.error(error.response?.data?.message || "Could not verify payment")
  } finally {
    toast.dismiss(toastId)
    dispatch(setPaymentLoading(false))
  }
}
