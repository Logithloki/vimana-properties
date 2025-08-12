'use client';

import React, { useState, useEffect } from 'react';

interface MortgageCalculatorProps {
  propertyPrice?: number;
  className?: string;
}

interface CalculationResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  principalAndInterest: number;
  insurance: number;
  propertyTax: number;
  pmi: number;
}

export default function MortgageCalculator({ propertyPrice = 0, className = '' }: MortgageCalculatorProps) {
  const [homePrice, setHomePrice] = useState(propertyPrice || 500000);
  const [downPayment, setDownPayment] = useState(100000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTerm, setLoanTerm] = useState(30);
  const [interestRate, setInterestRate] = useState(6.5);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2);
  const [homeInsurance, setHomeInsurance] = useState(1200);
  const [pmiRate, setPmiRate] = useState(0.5);
  const [calculation, setCalculation] = useState<CalculationResult | null>(null);

  // Update down payment when percentage changes
  useEffect(() => {
    const newDownPayment = (homePrice * downPaymentPercent) / 100;
    setDownPayment(newDownPayment);
  }, [homePrice, downPaymentPercent]);

  // Update percentage when down payment changes
  const handleDownPaymentChange = (value: number) => {
    setDownPayment(value);
    setDownPaymentPercent((value / homePrice) * 100);
  };

  // Calculate mortgage
  useEffect(() => {
    const calculateMortgage = () => {
      const principal = homePrice - downPayment;
      const monthlyRate = interestRate / 100 / 12;
      const numPayments = loanTerm * 12;
      
      // Monthly principal and interest
      const monthlyPI = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                       (Math.pow(1 + monthlyRate, numPayments) - 1);
      
      // Monthly property tax
      const monthlyTax = (homePrice * (propertyTaxRate / 100)) / 12;
      
      // Monthly insurance
      const monthlyInsurance = homeInsurance / 12;
      
      // PMI (if down payment is less than 20%)
      const monthlyPMI = downPaymentPercent < 20 ? (principal * (pmiRate / 100)) / 12 : 0;
      
      // Total monthly payment
      const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI;
      
      // Total interest over life of loan
      const totalInterest = (monthlyPI * numPayments) - principal;
      
      // Total payment over life of loan
      const totalPayment = monthlyPI * numPayments;

      setCalculation({
        monthlyPayment: totalMonthly,
        totalInterest,
        totalPayment,
        principalAndInterest: monthlyPI,
        insurance: monthlyInsurance,
        propertyTax: monthlyTax,
        pmi: monthlyPMI,
      });
    };

    calculateMortgage();
  }, [homePrice, downPayment, downPaymentPercent, loanTerm, interestRate, propertyTaxRate, homeInsurance, pmiRate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCurrencyDecimal = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className={`bg-white rounded-lg shadow-xl p-6 border border-primary-100/50 ${className}`}>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Mortgage Calculator</h3>
        <p className="text-gray-600">Calculate your monthly mortgage payments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Home Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Home Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={homePrice}
                onChange={(e) => setHomePrice(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="500,000"
              />
            </div>
          </div>

          {/* Down Payment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Down Payment
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative ">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$ </span>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={Math.round(downPaymentPercent * 100) / 100}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  step="0.1"
                  min="0"
                  max="100"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
              </div>
            </div>
          </div>

          {/* Loan Term */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Term
            </label>
            <select
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value={15}>15 years</option>
              <option value={30}>30 years</option>
            </select>
          </div>

          {/* Interest Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interest Rate
            </label>
            <div className="relative">
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                step="0.1"
                min="0"
                max="20"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4">Additional Costs</h4>
            
            {/* Property Tax */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Tax Rate (Annual)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={propertyTaxRate}
                  onChange={(e) => setPropertyTaxRate(Number(e.target.value))}
                  className="w-full pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  step="0.1"
                  min="0"
                  max="10"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
              </div>
            </div>

            {/* Home Insurance */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Home Insurance (Annual)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={homeInsurance}
                  onChange={(e) => setHomeInsurance(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* PMI */}
            {downPaymentPercent < 20 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PMI Rate (Annual)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={pmiRate}
                    onChange={(e) => setPmiRate(Number(e.target.value))}
                    className="w-full pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    step="0.1"
                    min="0"
                    max="2"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  PMI is required when down payment is less than 20%
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {calculation && (
            <>
              {/* Monthly Payment Breakdown */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Monthly Payment</h4>
                <div className="text-3xl font-bold text-blue-600 mb-4">
                  {formatCurrencyDecimal(calculation.monthlyPayment)}
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Principal & Interest</span>
                    <span className="font-semibold">{formatCurrencyDecimal(calculation.principalAndInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Property Tax</span>
                    <span className="font-semibold">{formatCurrencyDecimal(calculation.propertyTax)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Home Insurance</span>
                    <span className="font-semibold">{formatCurrencyDecimal(calculation.insurance)}</span>
                  </div>
                  {calculation.pmi > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">PMI</span>
                      <span className="font-semibold">{formatCurrencyDecimal(calculation.pmi)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Loan Summary */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4">Loan Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Loan Amount</span>
                    <span className="font-semibold">{formatCurrency(homePrice - downPayment)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Interest</span>
                    <span className="font-semibold">{formatCurrency(calculation.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Payment</span>
                    <span className="font-semibold">{formatCurrency(calculation.totalPayment)}</span>
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-green-50 rounded-lg p-6">
                <h4 className="text-lg font-bold text-gray-800 mb-3">💡 Tips to Save Money</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Increase your down payment to reduce monthly payments</li>
                  <li>• Consider a 15-year loan for lower total interest</li>
                  <li>• Shop around for better interest rates</li>
                  <li>• Improve your credit score before applying</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
