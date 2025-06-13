import '../../App.css';
import React, { useEffect, useState } from "react";
import { getUsers } from "../../comunication/FetchUser";

/**
 * Users
 * @author Peter Rutschmann
 */
const Users = ({ loginValues }) => {
    const [users, setUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await getUsers();
                console.log(users);
                setUsers(users);
            } catch (error) {
                console.error('Failed to fetch to server:', error.message);
                setErrorMessage(error.message);
            }
        };
        fetchUsers();
    }, [loginValues]);

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '1.5rem',
        textAlign: 'left',
        color: '#4a5568',
        fontSize: '1rem'
    };

    const thStyle = {
        borderBottom: '2px solid #e2e8f0',
        padding: '0.75rem 1rem',
        fontWeight: 600
    };

    const tdStyle = {
        borderBottom: '1px solid #e2e8f0',
        padding: '0.75rem 1rem'
    };

    return (
        <div style={{
            minHeight: 'calc(100vh - 60px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: 'radial-gradient(circle at 50% 30%, #f0f4f9 60%, #b9c6e3 100%)'
        }}>
            <div style={{
                background: '#fff',
                borderRadius: '1.5rem',
                boxShadow: '0 8px 24px 0 rgba(60, 72, 100, 0.15)',
                padding: '2.5rem 3rem',
                width: '100%',
                maxWidth: '900px', // Increased width for table
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
            }}>
                <h1 style={{
                    fontWeight: 700,
                    color: '#2d3748',
                    fontSize: '2.2rem',
                    letterSpacing: '.5px',
                    margin: '0 0 0.5rem 0'
                }}>
                    User List
                </h1>

                {errorMessage && <p style={{ color: 'red', margin: '0 0 1rem 0' }}>{errorMessage}</p>}

                <div style={{ overflowX: 'auto' }}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>ID</th>
                                <th style={thStyle}>First Name</th>
                                <th style={thStyle}>Last Name</th>
                                <th style={thStyle}>Email</th>
                                <th style={thStyle}>Password</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td style={tdStyle}>{user.id}</td>
                                    <td style={tdStyle}>{user.firstName}</td>
                                    <td style={tdStyle}>{user.lastName}</td>
                                    <td style={tdStyle}>{user.email}</td>
                                    <td style={tdStyle}>{user.password}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Users;