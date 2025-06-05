import '../App.css';

/**
 * Home
 * @author Peter Rutschmann
 */
const Home = () => {
    return (
        <div style={{ // Style for the entire page background and centering
            minHeight: 'calc(100vh - 60px)', // Assuming a header/navbar of 60px, adjust if needed
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px', // Add some padding around the content box
            background: 'radial-gradient(circle at 50% 30%, #f0f4f9 60%, #b9c6e3 100%)'
        }}>
            <div style={{ // Style for the content box
                background: '#fff',
                borderRadius: '1.5rem', // Slightly less rounded than forms, or keep '2rem'
                boxShadow: '0 8px 24px 0 rgba(60, 72, 100, 0.15)',
                padding: '2.5rem 3rem', // Generous padding
                width: '100%',
                maxWidth: '800px', // Allow it to be reasonably wide for content
                textAlign: 'center', // Center the text content within the box
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem' // Space between heading and paragraphs
            }}>
                <h1 style={{
                    fontWeight: 700,
                    color: '#2d3748',
                    fontSize: '2.2rem', // Slightly larger for a home page title
                    letterSpacing: '.5px',
                    margin: '0 0 0.5rem 0' // Adjust margin as needed
                }}>
                    Speichern Sie Ihre Daten sicher ab.
                </h1>
                <div style={{ textAlign: 'left', color: '#4a5568', fontSize: '1.1rem', lineHeight: '1.6' }}>
                    <p style={{ margin: '0 0 1rem 0' }}>
                        In dieser Applikation können Sie, nachdem Sie sich registriert haben, Ihre sensitiven Daten verschlüsselt
                        in einer Datenbank speichern.
                    </p>
                    <p style={{ margin: '0' }}>
                        Erstellen Sie ein neues Secret. Wählen Sie zwischen Credentials, Credit-Cards und Notes.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home;