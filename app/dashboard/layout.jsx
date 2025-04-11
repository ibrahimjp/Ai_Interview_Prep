import React from 'react'
import Header from './_components/Header'
import { ClerkProvider } from '@clerk/nextjs';

const DashBoardLayout = ({children}) => {
  return (
    <ClerkProvider>
    <div>
      <Header/>
      <div className='mx-5 md:mx-20 lg:mx-36'>
      {children}
      </div>
    </div>
        </ClerkProvider>
  )
}

export default DashBoardLayout