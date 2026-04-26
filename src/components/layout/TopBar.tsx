import { Search, Bell, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

export function TopBar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error("Failed to log out", err);
    }
  };

  return (
    <header className="bg-surface text-primary flex justify-between items-center w-full px-8 py-5 z-10 sticky top-0">
      <div className="flex-1 flex items-center max-w-md">
        <div className="relative w-full">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input 
            className="w-full bg-surface-container-highest border-none rounded-md py-2.5 pl-10 pr-4 text-sm font-body text-on-surface placeholder:text-on-surface-variant focus:ring-0 focus:bg-surface-container-lowest focus:outline outline-2 outline-primary/30 transition-all" 
            placeholder="Search documents, clients..." 
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button className="text-on-surface hover:text-primary transition-colors">
          <Bell size={20} />
        </button>
        <div className="h-8 w-8 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant/15">
          <img 
            alt="Notary Profile" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxYqWLrQpvzDzQNR2FNC4sdpThENrfwk_g3LA9fTXbrUvXTSoNPsV35_IKk3ANE_XarOOqBWXtrHcMEQGjkKhshT2uHBwfofpHjoCMY7jZO72m81pWFXtIS1sI56wUsp4C4ugfusK6y-M09xaSFJUhvnImr_8JB_YPVVUA3Vm1l5YTQ6rKaysB_O5vmche0JBUtvIVl0O1lSI0UsXeSmOB5czU_bDbq7Cndf2We1Ix-LYgV7eFs9MJYQqddgh3pDBW0g8nKbYdmeE9"
          />
        </div>
        <button onClick={handleLogout} className="text-on-surface hover:text-error transition-colors flex items-center gap-2 font-label text-sm font-bold uppercase tracking-wider">
          <LogOut size={20} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
