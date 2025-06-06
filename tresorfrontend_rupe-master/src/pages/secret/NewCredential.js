import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {postSecret} from "../../comunication/FetchSecrets";

/**
 * NewCredential
 * @author Peter Rutschmann
 */
function NewCredential({loginValues}) {
    const initialState = {
        kindid: 1,
        kind:"credential",
        userName: "",
        password: "",
        url: ""
    };
    const [credentialValues, setCredentialValues] = useState(initialState);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            const content = credentialValues;
            await postSecret({loginValues, content});
            setCredentialValues(initialState);
            navigate('/secret/secrets');
        } catch (error) {
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
                borderRadius: '1.5rem',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                padding: '2.5rem 2rem',
                minWidth: '340px',
                width: '100%',
                maxWidth: '400px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem'
            }}>
                <h2 style={{
                    textAlign: 'center',
                    marginBottom: '1rem',
                    color: '#2d3748',
                    letterSpacing: '1px'
                }}>Add new credential secret</h2>
                <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
                        <label style={{ fontWeight: 500, color: '#4a5568', marginBottom: '.2rem' }}>Username</label>
                        <input
                            type="text"
                            value={credentialValues.userName}
                            onChange={(e) =>
                                setCredentialValues(prevValues => ({...prevValues, userName: e.target.value}))}
                            required
                            placeholder="Please enter username"
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
                        <label style={{ fontWeight: 500, color: '#4a5568', marginBottom: '.2rem' }}>Password</label>
                        <input
                            type="text"
                            value={credentialValues.password}
                            onChange={(e) =>
                                setCredentialValues(prevValues => ({...prevValues, password: e.target.value}))}
                            required
                            placeholder="Please enter password"
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
                        <label style={{ fontWeight: 500, color: '#4a5568', marginBottom: '.2rem' }}>URL</label>
                        <input
                            type="text"
                            value={credentialValues.url}
                            onChange={(e) =>
                                setCredentialValues(prevValues => ({...prevValues, url: e.target.value}))}
                            required
                            placeholder="Please enter url"
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
                    <button type="submit"
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
                        Save secret
                    </button>
                    {errorMessage && <p style={{color: 'red', marginTop: '1rem'}}>{errorMessage}</p>}
                </form>
            </div>
        </div>
    );
}

export default NewCredential;