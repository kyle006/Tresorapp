import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { postUser } from "../../comunication/FetchUser";
import ReCAPTCHA from "react-google-recaptcha";

/**
 * RegisterUser
 * @author Peter Rutschmann
 */
function RegisterUser({ loginValues, setLoginValues }) {
    const navigate = useNavigate();

    const initialState = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        errorMessage: ""
    };
    const [credentials, setCredentials] = useState(initialState);
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordErrors, setPasswordErrors] = useState([]);
    const recaptchaRef = useRef();
    const [captchaToken, setCaptchaToken] = useState(null);

    const validatePassword = (password) => {
        const errors = [];
        if (password.length < 8) {
            errors.push("Password must be at least 8 characters long.");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("Password must contain at least one uppercase letter.");
        }
        if (!/[a-z]/.test(password)) {
            errors.push("Password must contain at least one lowercase letter.");
        }
        if (!/[0-9]/.test(password)) {
            errors.push("Password must contain at least one digit.");
        }
        if (!/[^a-zA-Z0-9]/.test(password)) {
            errors.push("Password must contain at least one special character.");
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setPasswordErrors([]);

        const currentToken = captchaToken;

        if (!currentToken) {
            setErrorMessage("Please complete the ReCaptcha.");
            return;
        }

        //validate password strength
        const currentPasswordErrors = validatePassword(credentials.password);
        if (currentPasswordErrors.length > 0) {
            setPasswordErrors(currentPasswordErrors);
            return;
        }

        //validate
        if (credentials.password !== credentials.passwordConfirmation) {
            console.log("password != passwordConfirmation");
            setErrorMessage('Password and password-confirmation are not equal.');
            return;
        }

        try {
            const payload = { ...credentials, captchaToken: currentToken };
            await postUser(payload);
            setLoginValues({ userName: credentials.email, password: credentials.password });
            setCredentials(initialState);
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
            }
            setCaptchaToken(null);
            navigate('/');
        } catch (error) {
            console.error('Failed to fetch to server:', error.message);
            setErrorMessage(error.message);
        }
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
                padding: '2.5rem',
                width: '100%',
                maxWidth: '750px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem'
            }}>
                <h2 style={{
                    fontWeight: 700,
                    color: '#2d3748',
                    margin: '0 0 0.5rem 0',
                    fontSize: '1.7rem',
                    letterSpacing: '.5px',
                    textAlign: 'center'
                }}>Register User</h2>
                <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

                    <div style={{ display: 'flex', gap: '1.2rem', width: '100%' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem', flex: 1 }}>
                            <label htmlFor="firstName" style={{ fontWeight: 500, color: '#4a5568', marginBottom: '.2rem' }}>First Name:</label>
                            <input
                                id="firstName"
                                type="text"
                                value={credentials.firstName}
                                onChange={(e) =>
                                    setCredentials(prevValues => ({ ...prevValues, firstName: e.target.value }))}
                                required
                                placeholder="Please enter your firstname *"
                                style={{
                                    padding: '.7rem',
                                    borderRadius: '.7rem',
                                    border: '1.5px solid #cbd5e1',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    background: '#f7fafc',
                                    transition: 'border-color 0.2s',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={e => e.target.style.borderColor = '#667eea'}
                                onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem', flex: 1 }}>
                            <label htmlFor="lastName" style={{ fontWeight: 500, color: '#4a5568', marginBottom: '.2rem' }}>Last Name:</label>
                            <input
                                id="lastName"
                                type="text"
                                value={credentials.lastName}
                                onChange={(e) =>
                                    setCredentials(prevValues => ({ ...prevValues, lastName: e.target.value }))}
                                required
                                placeholder="Please enter your lastname *"
                                style={{
                                    padding: '.7rem',
                                    borderRadius: '.7rem',
                                    border: '1.5px solid #cbd5e1',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    background: '#f7fafc',
                                    transition: 'border-color 0.2s',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={e => e.target.style.borderColor = '#667eea'}
                                onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                        <label htmlFor="email" style={{ fontWeight: 500, color: '#4a5568', marginBottom: '.2rem' }}>Email:</label>
                        <input
                            id="email"
                            type="email"
                            value={credentials.email}
                            onChange={(e) =>
                                setCredentials(prevValues => ({ ...prevValues, email: e.target.value }))}
                            required
                            placeholder="Please enter your email *"
                            style={{
                                padding: '.7rem',
                                borderRadius: '.7rem',
                                border: '1.5px solid #cbd5e1',
                                fontSize: '1rem',
                                outline: 'none',
                                background: '#f7fafc',
                                transition: 'border-color 0.2s',
                                width: '100%',
                                boxSizing: 'border-box'
                            }}
                            onFocus={e => e.target.style.borderColor = '#667eea'}
                            onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1.2rem', width: '100%' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem', flex: 1 }}>
                            <label htmlFor="password" style={{ fontWeight: 500, color: '#4a5568', marginBottom: '.2rem' }}>Password:</label>
                            <input
                                id="password"
                                type="password"
                                value={credentials.password}
                                onChange={(e) => {
                                    setCredentials(prevValues => ({ ...prevValues, password: e.target.value }));
                                    setPasswordErrors(validatePassword(e.target.value));
                                }}
                                required
                                placeholder="Please enter your password *"
                                style={{
                                    padding: '.7rem',
                                    borderRadius: '.7rem',
                                    border: '1.5px solid #cbd5e1',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    background: '#f7fafc',
                                    transition: 'border-color 0.2s',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={e => e.target.style.borderColor = '#667eea'}
                                onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem', flex: 1 }}>
                            <label htmlFor="passwordConfirmation" style={{ fontWeight: 500, color: '#4a5568', marginBottom: '.2rem' }}>Password Confirmation:</label>
                            <input
                                id="passwordConfirmation"
                                type="password"
                                value={credentials.passwordConfirmation}
                                onChange={(e) =>
                                    setCredentials(prevValues => ({ ...prevValues, passwordConfirmation: e.target.value }))}
                                required
                                placeholder="Please confirm your password *"
                                style={{
                                    padding: '.7rem',
                                    borderRadius: '.7rem',
                                    border: '1.5px solid #cbd5e1',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    background: '#f7fafc',
                                    transition: 'border-color 0.2s',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={e => e.target.style.borderColor = '#667eea'}
                                onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                            />
                        </div>
                    </div>

                    {/* Error messages moved before ReCAPTCHA */}
                    {errorMessage &&
                        <p style={{
                            color: '#e53e3e',
                            textAlign: 'center',
                            marginTop: '1rem',
                            background: '#fed7d7',
                            padding: '.7rem',
                            borderRadius: '.7rem',
                            border: '1px solid #f56565'
                        }}>{errorMessage}</p>}
                    {passwordErrors.length > 0 && (
                        <div style={{
                            color: '#e53e3e',
                            marginTop: '1rem',
                            border: '1px solid #f56565',
                            background: '#fed7d7',
                            padding: '1rem',
                            borderRadius: '.7rem'
                        }}>
                            <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>Password errors:</p>
                            <ul style={{ margin: '0', paddingLeft: '20px' }}>
                                {passwordErrors.map((error, index) => (
                                    <li key={index} style={{ marginBottom: '0.25rem' }}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0' }}>
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                            onChange={(token) => {
                                setCaptchaToken(token);
                            }}
                            onExpired={() => {
                                setCaptchaToken(null);
                            }}
                            onError={() => {
                                setCaptchaToken(null);
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            marginTop: '0.5rem',
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
                        onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #5a67d8 0%, #667eea 100%)'}
                        onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #667eea 0%, #5a67d8 100%)'}
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RegisterUser;
