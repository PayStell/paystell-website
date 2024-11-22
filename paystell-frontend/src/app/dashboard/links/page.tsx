export default function ProductForm() {
    return (
      <div className="w-full max-w-md mx-auto p-4 sm:p-6">
        <form className="space-y-4 sm:space-y-6">
          <div className="space-y-1 sm:space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="T-shirt"
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
  
          <div className="space-y-1 sm:space-y-2">
            <label
              htmlFor="currency"
              className="block text-sm font-medium text-gray-700"
            >
              Currency
            </label>
            <select
              id="currency"
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="USDC">USDC</option>
              <option value="ETH">ETH</option>
              <option value="BTC">BTC</option>
            </select>
          </div>
  
          <div className="space-y-1 sm:space-y-2">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <input
              id="price"
              type="text"
              placeholder="Amount"
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
  
          <div className="space-y-1 sm:space-y-2">
            <label
              htmlFor="sku"
              className="block text-sm font-medium text-gray-700"
            >
              SKU (Optional)
            </label>
            <input
              id="sku"
              type="text"
              placeholder="ID"
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
  
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md text-sm sm:text-base py-2 sm:py-3 transition duration-150 ease-in-out"
          >
            + New Link
          </button>
        </form>
      </div>
    )
  }
  
  