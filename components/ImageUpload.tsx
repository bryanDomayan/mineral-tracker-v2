"use client"
import { Loader, LoaderCircle, Upload } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

export default function ImageUpload({
    onLoading,
    image,
    onFinish
}: {
    onLoading?: () => void,
    image?: string,
    onFinish?: (val: string) => void
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [imageUrl, setImageUrl] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if (image) {
            setImageUrl(image)
        }
    }, [image])

    const triggerFileInput = () => {
        if (inputRef.current) {
            inputRef.current.click()
        }
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setLoading(true)
            onLoading && onLoading()
            const file = e.target.files[0]
            const type = file.type.split("/")
            console.log(file)
            const res = await fetch(`/api/upload?type=${type[1]}`, {
                method: "POST",
                body: file
            })

            if (!res.ok) {
                return alert("Failed to upload image.")
            }
            const data = await res.json()
            setImageUrl(data)
            setLoading(false)
            onFinish && onFinish(data as string)
        }
    }

    return (
        <>
            <div className="aspect-square overflow-hidden border-2 border-dashed rounded-sm">
                <div onClick={triggerFileInput} className='relative cursor-pointer hover:opacity-50 h-full w-full flex justify-center items-center'>
                    {loading ? (
                        <LoaderCircle className='absolute text-gray-400 animate-spin' size={34} />
                    ) : imageUrl ? (
                        <img 
                            src={imageUrl}
                            className='h-full w-auto object-center object-cover'
                        />
                    ): (
                        <Upload className='text-gray-400' size={24} />
                    )} 
                </div>
            </div>
            <input 
                className='hidden'
                ref={inputRef} 
                type='file' 
                onChange={(e) => handleUpload(e)}
                accept="image/*"
            />
        </>
    )
}
