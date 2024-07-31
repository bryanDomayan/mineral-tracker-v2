"use client"
import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'

export interface TableType {
    data: any[],
    column: any[]
}

export default function DataTable({ data, column }: TableType) {

    return (
        <div className='bg-white rounded-xl p-4 px-5'>
            <div className='flex justify-between'>
                <div className='space-y-2'>
                    <h2 className='text-xl'>Department Records</h2>
                    <Input placeholder='Search....' />
                </div>
                <Button>
                    Create new
                    <Plus className="ml-2 h-4 w-4" />
                </Button>
            </div>
            <div className='border-b mt-3'></div>
            <Table>
                <TableHeader>
                    <TableRow>
                        {column.map((d, i) => (
                            <TableHead className={`capitalize ${(i + 1) == column.length ? 'text-center' : ''} ${i == 0 ? 'text-start' : ''}`} key={i}>{d?.text}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length ? data.map((row, i) => (
                        <TableRow key={i}>
                            {column.map((d, j) => (
                                <TableCell
                                    className={`capitalize ${(j + 1) == column.length ? 'text-center' : ''} ${j == 0 ? 'text-start' : ''}`}
                                    key={j}
                                >
                                    {row[`${d.key}`]}
                                </TableCell>
                            ))}
                        </TableRow>
                    )) : (
                        <TableRow className='h-32'>
                            <TableCell className='text-center' colSpan={column.length}>No records</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className={`${data.length > 4 ? 'mt-2' : 'mt-40'}`}>
                <Pagination className='justify-end'>
                    <PaginationContent>
                        <PaginationItem>
                        <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                        <PaginationLink href="#" isActive>
                            2
                        </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                        <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                        <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    )
}
