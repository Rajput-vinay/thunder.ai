import { useContext, useState } from "react";
import { Button } from "../components/ui/button";
import Lookup from "../data/Lookup";
import {  PayPalButtons } from "@paypal/react-paypal-js";
import { userDetailsContext } from "../context/userDetailsContext";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
export default function PricingModel() {
  
  const {userDetails,seUserDetails} = useContext(userDetailsContext)
  const [selectedOption, setSelectedOption] = useState()
  const UpdateToken = useMutation(api.users.UpdateToken)
  const onPaymentSuccess = async() =>{
       const token = Number(userDetails?.token) + Number(selectedOption?.value )
        console.log("token,", token)

        await UpdateToken({
          userId:userDetails?._id,
          token:token
        })
      }   
  
  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Lookup.PRICING_OPTIONS.map((pricing, index) => (
        <div className="border p-7 rounded-xl flex flex-col gap-3" key={index} >
            <h2 className="font-bold text-2xl">{pricing.name}</h2>
            <h2 className="font-medium text-lg">{pricing.tokens} Token</h2>
            <p className="text-gray-400">{pricing.desc}</p>
            
            <h2 className="font-bold text-4xl text-center mt-6 ">${pricing.price}</h2>

            {/* <Button>Upgrade to {pricing.name}</Button> */}
            <PayPalButtons
            onClick={()=>setSelectedOption(pricing)}
             disabled= {!userDetails}
            style={{ layout: "horizontal" }} 
             createOrder={(data,actions) =>{
              return actions.order.create({
                purchase_units:[
                  {
                    amount:{
                      value:pricing.price,
                      currency_code:'USD'
                    }
                  }
                ]
              })
             }}
             onApprove={()=> onPaymentSuccess(pricing)}
             onCancel={()=> console.log("payment cancel")}
            />
        </div>
      ))}
    </div>
  );
}
