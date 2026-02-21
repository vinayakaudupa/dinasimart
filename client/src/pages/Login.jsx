import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();

    const handleLogin = () => {
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/');
    };

    return (
        <div className="flex justify-center items-center" style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, background: 'linear-gradient(135deg, #fef9c3 0%, #dcfce7 100%)', position: 'fixed', top: 0, left: 0 }}>
            <div className="card flex flex-col items-center gap-4" style={{ padding: '3rem', minWidth: '350px', zIndex: 10 }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: 'bold' }}>DinasiMart</h1>
                <p style={{ color: 'var(--gray-500)' }}>Your daily needs, delivered.</p>
                <button onClick={handleLogin} className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem', marginTop: '1rem' }}>
                    Login with Phone/Email
                </button>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>By logging in, you agree to our Terms.</p>
            </div>
        </div>
    );
}
