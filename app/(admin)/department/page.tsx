import Container from '@/components/Container'
import DataTable from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'
import { Plus } from 'lucide-react'

const invoices = [
    // {
    //   invoice: "INV001",
    //   paymentStatus: "Paid",
    //   totalAmount: "$250.00",
    //   paymentMethod: "Credit Card",
    // },
    {
      invoice: "INV002",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },
    // {
    //   invoice: "INV003",
    //   paymentStatus: "Unpaid",
    //   totalAmount: "$350.00",
    //   paymentMethod: "Bank Transfer",
    // },
    // {
    //   invoice: "INV004",
    //   paymentStatus: "Paid",
    //   totalAmount: "$450.00",
    //   paymentMethod: "Credit Card",
    // },
    // {
    //   invoice: "INV005",
    //   paymentStatus: "Paid",
    //   totalAmount: "$550.00",
    //   paymentMethod: "PayPal",
    // },
    // {
    //   invoice: "INV006",
    //   paymentStatus: "Pending",
    //   totalAmount: "$200.00",
    //   paymentMethod: "Bank Transfer",
    // },
    // {
    //   invoice: "INV007",
    //   paymentStatus: "Unpaid",
    //   totalAmount: "$300.00",
    //   paymentMethod: "Credit Card",
    // },
  ]

const columns = [
    {
        key: "invoice",
        text: "Invoice",
    },
    {
        key: "paymentStatus",
        text: "Status",
    },
    {
        key: "totalAmount",
        text: "Total",
    },
    {
        key: "paymentMethod",
        text: "Payment",
    },
]

export default function DepartmentPage() {
    return (
        <Container>
            <div>
                <DataTable 
                    data={invoices}
                    column={columns}
                />
            </div>
        </Container>
    )
}
