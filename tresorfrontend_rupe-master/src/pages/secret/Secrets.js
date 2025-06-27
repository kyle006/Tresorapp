import '../../App.css';
import React, { useState } from 'react';
import { getSecretsforUser } from "../../comunication/FetchSecrets";

/**
 * Secrets
 * @author Peter Rutschmann
 */
const Secrets = ({ loginValues }) => {
    const [secrets, setSecrets] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [password, setPassword] = useState('');

    const handleFetchSecrets = async () => {
        if (!password) {
            setErrorMessage("Please enter your password to decrypt secrets.");
            return;
        }
        setErrorMessage('');
        try {
            const data = await getSecretsforUser(password);
            setSecrets(data);
            if (data.some(s => s.content === 'DECRYPTION_FAILED')) {
                setErrorMessage("One or more secrets could not be decrypted. Is the password correct?");
            }
        } catch (error) {
            console.error('Failed to fetch secrets:', error.message);
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
                maxWidth: '900px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem'
            }}>
                <h1 style={{
                    textAlign: 'center',
                    marginBottom: '1rem',
                    color: '#2d3748',
                    letterSpacing: '1px'
                }}>My Secrets</h1>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', width: '100%', maxWidth: '500px' }}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password to decrypt"
                        style={{
                            padding: '.7rem',
                            borderRadius: '.7rem',
                            border: '1.5px solid #cbd5e1',
                            fontSize: '1rem',
                            outline: 'none',
                            background: '#f7fafc',
                            flex: 1
                        }}
                    />
                    <button onClick={handleFetchSecrets} style={{ padding: '.7rem 1.5rem', background: '#5a67d8', color: 'white', border: 'none', borderRadius: '.7rem', cursor: 'pointer' }}>
                        Show Secrets
                    </button>
                </div>

                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <div style={{ width: '100%' }}>
                    <h2 style={{ color: '#4a5568', marginBottom: '1rem', fontWeight: 600 }}>Secrets</h2>
                    <div style={{
                        overflowX: 'auto',
                        borderRadius: '1rem',
                        boxShadow: '0 2px 8px rgba(31,38,135,0.06)',
                        background: '#f8fafc',
                        padding: '1rem',
                        width: '100%',
                        maxWidth: '100vw'
                    }}>
                        <div style={{ minWidth: '700px' }}>
                            <table style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                background: '#fff',
                                borderRadius: '1rem',
                                overflow: 'hidden'
                            }}>
                                <thead>
                                    <tr style={{ background: '#e9eefc' }}>
                                        <th style={{ padding: '.8rem', fontWeight: 600, color: '#5a67d8', borderBottom: '2px solid #e2e8f0' }}>Secret ID</th>
                                        <th style={{ padding: '.8rem', fontWeight: 600, color: '#5a67d8', borderBottom: '2px solid #e2e8f0' }}>User ID</th>
                                        <th style={{ padding: '.8rem', fontWeight: 600, color: '#5a67d8', borderBottom: '2px solid #e2e8f0' }}>Content</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {secrets?.length > 0 ? (
                                        secrets.map(secret => (
                                            <tr key={secret.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                <td style={{ padding: '.7rem', textAlign: 'center', color: '#2d3748' }}>{secret.id}</td>
                                                <td style={{ padding: '.7rem', textAlign: 'center', color: '#2d3748' }}>{secret.userId}</td>
                                                <td style={{ padding: '.7rem', color: secret.content === 'DECRYPTION_FAILED' ? 'red' : '#2d3748', fontFamily: 'monospace', background: '#f7fafc', borderRadius: '.5rem' }}>
                                                    <pre style={{ margin: 0, background: 'none', fontSize: '1rem' }}>
                                                        {secret.content !== 'DECRYPTION_FAILED' ? JSON.stringify(secret.content, null, 2) : 'DECRYPTION FAILED'}
                                                    </pre>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" style={{ padding: '1.2rem', textAlign: 'center', color: '#a0aec0' }}>No secrets available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Secrets;