'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function TradingCalculator() {
  const [inputs, setInputs] = useState({
    margin: '',
    profit: '',
    loss: '',
    leverage: '',
    marginLimit: ''
  })

  const [results, setResults] = useState<null | {
    actualRisk: number,
    expectedProfit: number,
    positionSize: number,
    marginRequired: number,
    totalFees: number
  }>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    })
  }

  const calculateTrade = () => {
    const { margin, profit, loss, leverage, marginLimit } = inputs
    
    // Convert inputs to numbers
    const max_risk = parseFloat(margin)
    const profit_percent = parseFloat(profit)
    const stop_loss_percent = parseFloat(loss)
    const leverage_value = parseFloat(leverage)
    const limit = parseFloat(marginLimit)

    // Validate inputs
    if ([max_risk, profit_percent, stop_loss_percent, leverage_value, limit].some(isNaN)) {
      alert('All inputs must be valid numbers')
      return
    }

    // Calculations
    let position_size = (max_risk * 100) / (stop_loss_percent + 2 * 0.04)
    let margin_required = position_size / leverage_value

    // Check margin limit and adjust if needed
    if (margin_required > limit) {
      position_size = limit * leverage_value
      margin_required = limit
      alert('Warning: Position size adjusted due to margin limit')
    }

    const total_fees = 2 * 0.04 * position_size / 100
    const position_loss = position_size * stop_loss_percent / 100
    const actual_risk = total_fees + position_loss
    const expected_profit = (position_size * profit_percent / 100) - total_fees

    setResults({
      actualRisk: parseFloat(actual_risk.toFixed(2)),
      expectedProfit: parseFloat(expected_profit.toFixed(2)),
      positionSize: parseFloat(position_size.toFixed(2)),
      marginRequired: parseFloat(margin_required.toFixed(2)),
      totalFees: parseFloat(total_fees.toFixed(2))
    })
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Trading Calculator</CardTitle>
          <CardDescription>Calculate your trade parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); calculateTrade(); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="margin">Maximum Risk</Label>
                <Input id="margin" name="margin" value={inputs.margin} onChange={handleInputChange} placeholder="Enter maximum risk" />
              </div>
              <div>
                <Label htmlFor="profit">Expected Profit %</Label>
                <Input id="profit" name="profit" value={inputs.profit} onChange={handleInputChange} placeholder="Enter expected profit %" />
              </div>
              <div>
                <Label htmlFor="loss">Stop Loss %</Label>
                <Input id="loss" name="loss" value={inputs.loss} onChange={handleInputChange} placeholder="Enter stop loss %" />
              </div>
              <div>
                <Label htmlFor="leverage">Leverage</Label>
                <Input id="leverage" name="leverage" value={inputs.leverage} onChange={handleInputChange} placeholder="Enter leverage" />
              </div>
              <div>
                <Label htmlFor="marginLimit">Margin Limit</Label>
                <Input id="marginLimit" name="marginLimit" value={inputs.marginLimit} onChange={handleInputChange} placeholder="Enter margin limit" />
              </div>
            </div>
            <Button type="submit">Calculate</Button>
          </form>

          {results && (
            <Table className="mt-8">
              <TableHeader>
                <TableRow>
                  <TableHead colSpan={2}>Trade Calculations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Maximum Risk:</TableCell>
                  <TableCell className="text-red-500 font-bold">{results.actualRisk}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Expected Profit %:</TableCell>
                  <TableCell>{inputs.profit}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Stop Loss %:</TableCell>
                  <TableCell>{inputs.loss}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Leverage:</TableCell>
                  <TableCell>{inputs.leverage}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Position Size:</TableCell>
                  <TableCell>{results.positionSize}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Margin Required:</TableCell>
                  <TableCell className="text-yellow-500 font-bold">{results.marginRequired}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Fees:</TableCell>
                  <TableCell>{results.totalFees}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Expected Profit:</TableCell>
                  <TableCell className="text-green-500 font-bold">{results.expectedProfit}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

