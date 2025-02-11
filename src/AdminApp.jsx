import React from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/SideBar'

function AdminApp({ children }) {
    return (
        <div>
            <Navbar>

            </Navbar>
            <Sidebar></Sidebar>
            <main className='pl-16 pt-16'>{children}
            </main>
            </div>
    )
}

export default AdminApp