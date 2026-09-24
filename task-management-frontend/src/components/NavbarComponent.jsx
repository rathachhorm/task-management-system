import { useNavigate } from 'react-router-dom';
import LoginService from '../services/login.service';

const NavbarComponent = () => {
    const navigate = useNavigate();
    const user = LoginService.getCurrentUser();
    const displayName = user?.name || user?.email || 'User';

    const handleLogout = () => {
        LoginService.logout();
        navigate('/login');
    };

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
            {/* Left: Brand */}
            <div className="flex items-center gap-2.5">
                <span className="font-bold text-slate-800 text-sm tracking-tight">Task Management</span>
            </div>

            {/* Right: User + Logout */}
            {user && (
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2.5">
                        <span className="text-sm text-slate-600 font-medium">{displayName}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="hidden sm:inline">Sign out</span>
                    </button>
                </div>
            )}
        </header>
    );
};

export default NavbarComponent;
