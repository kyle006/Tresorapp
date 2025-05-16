import { Outlet, Link } from "react-router-dom";

/**
 * Layout
 * @author Peter Rutschmann
 */
const Layout = ({loginValues}) => {
    return (
        <>
            <nav style={{
                background: '#f7fafc',
                borderBottom: '1.5px solid #e2e8f0',
                padding: '1.2rem 2rem',
                marginBottom: '1.5rem'
            }}>
                <h1 style={{
                    color: '#2d3748',
                    margin: 0,
                    fontSize: '1.7rem',
                    letterSpacing: '.5px'
                }}>The secret tresor application</h1>
                <p style={{ color: '#4a5568', margin: '.3rem 0 1rem 0', fontSize: '1rem' }}>
                    {loginValues.email === '' ? 'No user logged in' : 'User: ' + loginValues.email}
                </p>
                <ul style={{
                    display: 'flex',
                    gap: '2.5rem',
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                    alignItems: 'center'
                }}>
                    <li>
                        <span style={{ color: '#5a67d8', fontWeight: 600 }}>Secrets</span>
                        <ul style={{ marginTop: '.3rem', marginLeft: '1.2rem', listStyle: 'disc', color: '#4a5568', fontWeight: 500 }}>
                            <li><Link to="/secret/secrets" style={{ color: '#4a5568', textDecoration: 'none' }}>My secrets</Link></li>
                            <li><Link to="/secret/newcredential" style={{ color: '#4a5568', textDecoration: 'none' }}>New credential</Link></li>
                            <li><Link to="/secret/newcreditcard" style={{ color: '#4a5568', textDecoration: 'none' }}>New credit-card</Link></li>
                            <li><Link to="/secret/newnote" style={{ color: '#4a5568', textDecoration: 'none' }}>New note</Link></li>
                        </ul>
                    </li>
                    <li>
                        <span style={{ color: '#5a67d8', fontWeight: 600 }}>User</span>
                        <ul style={{ marginTop: '.3rem', marginLeft: '1.2rem', listStyle: 'disc', color: '#4a5568', fontWeight: 500 }}>
                            <li><Link to="/user/login" style={{ color: '#4a5568', textDecoration: 'none' }}>Login</Link></li>
                            <li><Link to="/user/register" style={{ color: '#4a5568', textDecoration: 'none' }}>Register</Link></li>
                        </ul>
                    </li>
                    <li>
                        <span style={{ color: '#5a67d8', fontWeight: 600 }}>Admin</span>
                        <ul style={{ marginTop: '.3rem', marginLeft: '1.2rem', listStyle: 'disc', color: '#4a5568', fontWeight: 500 }}>
                            <li><Link to="/user/users" style={{ color: '#4a5568', textDecoration: 'none' }}>All users</Link></li>
                            <li style={{ color: '#a0aec0' }}>Add user</li>
                            <li><Link to="/user/users/:id" style={{ color: '#4a5568', textDecoration: 'none' }}>Edit user</Link></li>
                            <li style={{ color: '#a0aec0' }}>All secrets</li>
                        </ul>
                    </li>
                    <li>
                        <Link to="/" style={{ color: '#5a67d8', fontWeight: 600, textDecoration: 'none' }}>About</Link>
                    </li>
                </ul>
            </nav>
            <Outlet/>
        </>
    )
};

export default Layout;