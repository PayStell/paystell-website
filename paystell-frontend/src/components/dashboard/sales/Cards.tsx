import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FiUsers } from "react-icons/fi";
import { MdShowChart } from "react-icons/md";
import { CiCreditCard1 } from "react-icons/ci"
import React from 'react'

const Cards = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10" >
      
  
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-row justify-between">
           <h2> Total Revenue</h2>
           <span>$</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-3xl font-bold">$45,231.89</div>
            <p className="text-base font-normal mt-2">20.1% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-row justify-between">
           <h2> Subscriptions</h2>
           <span><FiUsers /></span>
          </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-3xl font-bold">+3000</div>
            <p className="text-base font-normal mt-2">20.1% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-row justify-between">
           <h2>Sales</h2>
           <span><CiCreditCard1 /></span>
          </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-3xl font-bold">+12,234</div>
            <p className="text-base font-normal mt-2">20.1% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-row justify-between">
           <h2>Active Now</h2>
           <span><MdShowChart /></span>
          </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-3xl font-bold">+3000</div>
            <p className="text-base font-normal mt-2">20.1% from last month</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Cards
