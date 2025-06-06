import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postSecret } from "../../comunication/FetchSecrets";

/**
 * NewCreditCard
 * @author Peter Rutschmann
 */
function NewCreditCard({ loginValues }) {
    const initialState = {
        kindid: 2,
        kind: "creditcard",
        cardtype: "",
        cardnumber: "",
        expiration: "",
        cvv: ""
    };
    const [creditCardValues, setCreditCardValues] = useState(initialState);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            const content = creditCardValues;
            await postSecret({ loginValues, content });
            setCreditCardValues(initialState);
            navigate('/secret/secrets');
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
                padding: '2.5rem 2.5rem 2rem 2.5rem',
                width: '100%',
                maxWidth: '350px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2rem'
            }}>
                <h2 style={{
                    fontWeight: 700,
                    color: '#2d3748',
                    margin: 0,
                    fontSize: '1.7rem',
                    letterSpacing: '.5px'
                }}>Add new credit-card secret</h2>
                <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                        <label style={{ fontWeight: 500, color: '#4a5568', marginBottom: '.2rem' }}>card type:</label>
                        <select
                            value={creditCardValues.cardtype}
                            onChange={(e) =>
                                setCreditCardValues((prevValues) => ({
                                    ...prevValues,
                                    cardtype: e.target.value,
                                }))}
                            required
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
                        >
                            <option value="" disabled>
                                Please select card type
                            </option>
                            <option value="Visa">Visa</option>
                            <option value="Mastercard">Mastercard</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                        <label style={{ fontWeight: 500, color: '#4a5568', marginBottom: '.2rem' }}>cardnumber:</label>
                        <input
                            type="text"
                            value={creditCardValues.cardnumber}
                            onChange={(e) =>
                                setCreditCardValues(prevValues => ({ ...prevValues, cardnumber: e.target.value }))}
                            required
                            placeholder="Please enter cardnumber"
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
                        <label style={{ fontWeight: 500, color: '#4a5568', marginBottom: '.2rem' }}>expiration (mm/yy):</label>
                        <input
                            type="text"
                            value={creditCardValues.expiration}
                            onChange={(e) =>
                                setCreditCardValues(prevValues => ({ ...prevValues, expiration: e.target.value }))}
                            required
                            placeholder="Please enter expiration"
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
                        <label style={{ fontWeight: 500, color: '#4a5568', marginBottom: '.2rem' }}>cvv:</label>
                        <input
                            type="text"
                            value={creditCardValues.cvv}
                            onChange={(e) =>
                                setCreditCardValues(prevValues => ({ ...prevValues, cvv: e.target.value }))}
                            required
                            placeholder="Please enter cvv"
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
                    >Save secret</button>
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                </form>
            </div>
        </div>
    );
}

export default NewCreditCard;
