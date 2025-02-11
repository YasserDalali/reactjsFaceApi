import React from 'react'
import { twMerge } from 'tailwind-merge'
function ButtonLanding({content = "Get started", className }) {
  return (
    <button className={twMerge("bg-teal-500/20 px-4 py-2 border-teal-500 border rounded-lg hover:shadow-md hover:shadow-teal-500/50 transition-all hover:scale-105 font-semibold", className)}>{content}</button>
  )
}

export default ButtonLanding