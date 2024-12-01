import Header from "@/components/dashboard/sales/Header"
import Cards from "@/components/dashboard/sales/Cards"
import SalesHistory from "@/components/dashboard/sales/SalesHistory"

const SalesPage = () => {
  return (
    <div className="py-10 px-8">
        <Header/>
        <Cards/>
        <SalesHistory/>

    </div>
  )
}

export default SalesPage