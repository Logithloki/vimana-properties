import MortgageCalculator from '@/components/MortgageCalculator';

export default function MortgageCalculatorPage() {
  return (
    <div className="pt-12 pb-16 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 py-16 mb-12 shadow-lg">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Mortgage Calculator</h1>
          <p className="text-xl text-primary-100">
            Calculate your monthly mortgage payments and plan your home purchase
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <MortgageCalculator />
        
        {/* Additional Information */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-primary-600 mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Accurate Calculations</h3>
            <p className="text-gray-600">
              Our calculator uses industry-standard formulas to provide accurate monthly payment estimates including principal, interest, taxes, and insurance.
            </p>
          </div>          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-primary-600 mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Plan Your Budget</h3>
            <p className="text-gray-600">
              Use our calculator to understand how different loan terms, down payments, and interest rates affect your monthly budget.
            </p>
          </div>          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-primary-600 mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Compare Options</h3>
            <p className="text-gray-600">
              Experiment with different scenarios to find the mortgage terms that work best for your financial situation.
            </p>
          </div>
        </div>

        {/* Mortgage Tips */}
        <div className="mt-12 bg-amber-100 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-amber-700">Understanding Your Mortgage Payment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-amber-600">Principal & Interest</h3>
              <p className="text-gray-600 mb-4">
                This is the core of your mortgage payment. Principal reduces your loan balance, while interest is the cost of borrowing money.
              </p>
              
              <h3 className="text-lg font-semibold mb-3 text-amber-600">Property Taxes</h3>
              <p className="text-gray-600 mb-4 ">
                Annual taxes paid to local government, typically 1-2% of home value. Often collected monthly and held in escrow.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-amber-600">Homeowner&apos;s Insurance</h3>
              <p className="text-gray-600 mb-4">
                Required insurance to protect your home and belongings. Costs vary by location, home value, and coverage level.
              </p>
              
              <h3 className="text-lg font-semibold mb-3 text-amber-600">PMI (Private Mortgage Insurance)</h3>
              <p className="text-gray-600 mb-4">
                Required when down payment is less than 20%. Protects the lender if you default on the loan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
