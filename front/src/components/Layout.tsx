import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {

    return (
        <div className="min-h-screen bg-slate-50 dir-rtl" dir="rtl">
            <Navbar />

            <main className="max-w-6xl mx-auto p-4">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout