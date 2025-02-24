'use client'
import { userDetailsContext } from "../../../context/userDetailsContext";
import Lookup from "../../../data/Lookup";
import { useContext, } from "react";
import Colors from "../../../data/Colors";
import PricingModel from "../../../custom/PricingMode"

export default function pricing(){
    const {userDetails, setUserDetails} = useContext(userDetailsContext)
    return (
        <div className="mt-10 flex flex-col w-full p-10 md:px-32 lg:px-48 items-center ">
           <h2 className="font-bold text-5xl">Pricing</h2>
            <p className="text-gray-400 max-w-xl text-center mt-4">{Lookup.PRICING_DESC}</p>
          
          <div className="p-5 border rounded-xl w-full flex justify-between mt-7"
          style={{backgroundColor:Colors.BACKGROUND}}>
            <h2 className="text-lg"><span className="font-bold">{userDetails?.token}</span>Token Left</h2>
              
            <div className="">
                <h2 className="font-medium">Need more token?</h2>
                <p>Upgrade your below</p>
            </div>
            </div>
            <PricingModel />
        </div>
    )
}