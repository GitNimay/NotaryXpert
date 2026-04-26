import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { Documents } from "./pages/Documents";
import { Settings } from "./pages/Settings";
import { GiftDeedEditor } from "./pages/GiftDeedEditor";
import { Clients } from "./pages/Clients";
import { Login } from "./pages/Login";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase";
import { Loader2 } from "lucide-react";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center text-primary">
        <Loader2 size={48} className="animate-spin mb-4" />
        <h2 className="font-headline font-bold text-xl tracking-wider uppercase">Loading Secure Portal</h2>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        
        {/* Protected Routes */}
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
        <Route path="/documents" element={user ? <Documents /> : <Navigate to="/login" replace />} />
        <Route path="/documents/new" element={user ? <GiftDeedEditor /> : <Navigate to="/login" replace />} />
        <Route path="/clients" element={user ? <Clients /> : <Navigate to="/login" replace />} />
        <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" replace />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
