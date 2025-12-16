import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const InactivityMonitor = ({ timeout = 5 * 60 * 1000, children }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [showWarning, setShowWarning] = useState(false);
    const logoutTimerRef = useRef(null);
    const warningTimerRef = useRef(null);

    // Warning appears 1 minute before timeout
    const warningTime = Math.max(0, timeout - 60 * 1000);

    const handleLogout = useCallback(() => {
        if (user) {
            dispatch(logout());
            setShowWarning(false);
            alert('Session timed out due to inactivity.');
        }
    }, [dispatch, user]);

    const showWarningModal = useCallback(() => {
        setShowWarning(true);
    }, []);

    const resetTimer = useCallback(() => {
        if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
        if (warningTimerRef.current) clearTimeout(warningTimerRef.current);

        setShowWarning(false);

        if (user) {
            warningTimerRef.current = setTimeout(showWarningModal, warningTime);
            logoutTimerRef.current = setTimeout(handleLogout, timeout);
        }
    }, [handleLogout, showWarningModal, warningTime, timeout, user]);

    useEffect(() => {
        if (!user) return;

        const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

        // Initial timer start
        resetTimer();

        // Add event listeners
        events.forEach(event => {
            window.addEventListener(event, resetTimer);
        });

        // Cleanup
        return () => {
            if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
            if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
            events.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [resetTimer, user]);

    return (
        <>
            {children}
            {showWarning && user && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div style={{
                        background: '#1a1a2e',
                        padding: '2rem',
                        borderRadius: '10px',
                        textAlign: 'center',
                        border: '1px solid rgba(255,255,255,0.1)',
                        maxWidth: '90%',
                        width: '400px'
                    }}>
                        <h3>Are you still there?</h3>
                        <p style={{ margin: '1rem 0', color: '#ccc' }}>
                            You have been inactive. Your session will close in 1 minute.
                        </p>
                        <button
                            className="btn"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent trigger global click immediately
                                resetTimer();
                            }}
                            style={{ width: '100%' }}
                        >
                            I'm still here
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default InactivityMonitor;
