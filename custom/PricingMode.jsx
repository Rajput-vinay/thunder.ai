"use client"
import { useContext, useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { userDetailsContext } from "../context/userDetailsContext";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import Lookup from "../data/Lookup";
import { toast } from "sonner";

export default function PricingModel() {
  const { userDetails, setUserDetails } = useContext(userDetailsContext);
  const [selectedOption, setSelectedOption] = useState(null);
  const UpdateToken = useMutation(api.users.UpdateToken);

  const onPaymentSuccess = async (pricing) => {
    const newToken = Number(userDetails?.token) + Number(pricing?.value);

    await UpdateToken({
      userId: userDetails?._id,
      token: newToken,
    });
    

    setUserDetails({
      ...userDetails,
      token: newToken,
    });

   toast.success("Payment Successful 🎉", {
  description: `${pricing?.tokens} tokens added to your account.`,
});
  };

  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Lookup.PRICING_OPTIONS.map((pricing, index) => (
        <div className="border p-7 rounded-xl flex flex-col gap-3" key={index}>
          <h2 className="font-bold text-2xl">{pricing.name}</h2>
          <h2 className="font-medium text-lg">{pricing.tokens} Token</h2>
          <p className="text-gray-400">{pricing.desc}</p>
          <h2 className="font-bold text-4xl text-center mt-6">
            ${pricing.price}
          </h2>

          <PayPalButtons
            onClick={() => setSelectedOption(pricing)}
            disabled={!userDetails}
            style={{ layout: "horizontal" }}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: pricing.price,
                      currency_code: "USD",
                    },
                  },
                ],
              });
            }}
            onApprove={() => onPaymentSuccess(pricing)}
            onCancel={() => console.log("Payment canceled")}
          />
        </div>
      ))}
    </div>
  );
}
