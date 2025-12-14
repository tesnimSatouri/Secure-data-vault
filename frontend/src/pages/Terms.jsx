
import { Link } from 'react-router-dom'

function Terms() {
    return (
        <div className="card-container">
            <h1 className="card-title">Terms of Service</h1>
            <p className="card-subtitle">Last updated: December 2025</p>

            <div className="card-content">
                <h3>1. Acceptance of Terms</h3>
                <p>By accessing and using Secure Data Vault, you accept and agree to be bound by the terms and provision of this agreement.</p>

                <h3>2. Security & Encryption</h3>
                <p>We use AES-256 encryption to protect your data. However, you are responsible for maintaining the confidentiality of your master password. If you lose your password, we cannot recover your data.</p>

                <h3>3. User Responsibilities</h3>
                <p>You agree not to use the service for any illegal activities. You are solely responsible for the content you store in your vault.</p>

                <h3>4. Termination</h3>
                <p>We reserve the right to terminate your access to the service if you violate these terms.</p>

                <div className="text-center mt-4">
                    <Link to="/register" className="btn btn-reverse">
                        &larr; Back to Register
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Terms
