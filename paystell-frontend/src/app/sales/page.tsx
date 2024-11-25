import Header from "@/components/salesComponents/Header"
import Cards from "@/components/salesComponents/Cards"
import SalesHistory from "@/components/salesComponents/SalesHistory"

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
