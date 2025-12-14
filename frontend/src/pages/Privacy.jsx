
import { Link } from 'react-router-dom'

function Privacy() {
    return (
        <>
            <section className="heading">
                <h1>Privacy Policy</h1>
                <p>Your Data, Your Control</p>
            </section>

            <section className="content" style={{ textAlign: 'left' }}>
                <h3>1. GDPR Compliance</h3>
                <p>Secure Data Vault is fully compliant with the General Data Protection Regulation (GDPR). You have the right to access, rectify, and delete your data at any time.</p>

                <h3>2. Data Collection</h3>
                <p>We only collect the absolute minimum data required to operate the service: your email address (for authentication) and your encrypted vault data.</p>

                <h3>3. Zero-Knowledge Architecture</h3>
                <p>Your data is encrypted on your device before it reaches our servers. We cannot read your stored notes, passwords, or files. Only you hold the decryption key (your password).</p>

                <h3>4. Data Deletion</h3>
                <p>You can delete your account and all associated data instantly from your dashboard. This action is irreversible.</p>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <Link to="/register" className="btn">Back to Register</Link>
                </div>
            </section>
        </>
    )
}

export default Privacy
