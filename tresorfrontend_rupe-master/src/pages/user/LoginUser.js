import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';

/**
 * LoginUser
 * @author Peter Rutschmann
 */
function LoginUser({ loginValues, setLoginValues }) {
    const navigate = useNavigate();

    useEffect(() => {
        setLoginValues({
            email: "",
            password: ""
        })
    }, [setLoginValues]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(loginValues);
        navigate('/')
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at 50% 30%, #f0f4f9 60%, #b9c6e3 100%)'
        }}>
            <div style={{
                background: '#fff',
                borderRadius: '2rem',
                boxShadow: '0 10px 32px 0 rgba(60, 72, 100, 0.18)',
                padding: '2.5rem 2.5rem 2rem 2.5rem',
                width: '100%',
                maxWidth: '350px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2rem'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #5a67d8 100%)',
                    borderRadius: '50%',
                    width: '64px',
                    height: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.5rem'
                }}>
                    <svg width="32" height="32" fill="#fff" viewBox="0 0 24 24">
                        <path d="M12 12c2.7 0 8 1.34 8 4v2H4v-2c0-2.66 5.3-4 8-4zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                    </svg>
                </div>
                <h2 style={{
                    fontWeight: 700,
                    color: '#2d3748',
                    margin: 0,
                    fontSize: '1.7rem',
                    letterSpacing: '.5px'
                }}>Sign in</h2>
                <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                        <label style={{ fontWeight: 500, color: '#4a5568', marginBottom: '.2rem' }}>Email address</label>
                        <input
                            type="text"
                            value={loginValues.email}
                            onChange={(e) =>
                                setLoginValues(prevValues => ({ ...prevValues, email: e.target.value }))}
                            required
                            placeholder="you@example.com"
                            style={{
                                padding: '.7rem',
                                borderRadius: '.7rem',
                                border: '1.5px solid #cbd5e1',
                                fontSize: '1rem',
                                outline: 'none',
                                background: '#f7fafc',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={e => e.target.style.borderColor = '#667eea'}
                            onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                        <label style={{ fontWeight: 500, color: '#4a5568', marginBottom: '.2rem' }}>Password</label>
                        <input
                            type="password"
                            value={loginValues.password}
                            onChange={(e) =>
                                setLoginValues(prevValues => ({ ...prevValues, password: e.target.value }))}
                            required
                            placeholder="Enter your password"
                            style={{
                                padding: '.7rem',
                                borderRadius: '.7rem',
                                border: '1.5px solid #cbd5e1',
                                fontSize: '1rem',
                                outline: 'none',
                                background: '#f7fafc',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={e => e.target.style.borderColor = '#667eea'}
                            onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            marginTop: '1.2rem',
                            background: 'linear-gradient(90deg, #667eea 0%, #5a67d8 100%)',
                            color: '#fff',
                            padding: '.9rem',
                            border: 'none',
                            borderRadius: '.7rem',
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(90,103,216,0.10)',
                            transition: 'background 0.2s'
                        }}
                        onMouseOver={e => e.target.style.background = 'linear-gradient(90deg, #5a67d8 0%, #667eea 100%)'}
                        onMouseOut={e => e.target.style.background = 'linear-gradient(90deg, #667eea 0%, #5a67d8 100%)'}
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginUser;