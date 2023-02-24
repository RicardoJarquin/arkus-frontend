import { Link, Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useStateContext } from '../context/ContextProvider';
import axiosClient from '../axios-client.js';

export default function DefaultLayout() {
    const { user, token, setUser, setToken, notification } = useStateContext();

    if (!token) {
        return <Navigate to="/login" />;
    }

    const onLogout = (ev) => {
        ev.preventDefault();

        axiosClient.post('/logout').then(() => {
            setUser({});
            setToken(null);
        });
    };

    useEffect(() => {
        axiosClient.get('/users').then(({ data }) => {
            setUser(data);
        });
    }, []);

    return (
        <div id="defaultLayout">
            <aside>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/users">Users</Link>
                <Link to="/accounts">Accounts</Link>
            </aside>
            <div className="content">
                <header>
                    <div>Arkusnexus</div>

                    <div>
                        {user.name} &nbsp; &nbsp;
                        <a onClick={onLogout} className="btn-logout" href="#">
                            Logout
                        </a>
                    </div>
                </header>
                <main>
                    <Outlet />
                </main>
                {notification && (
                    <div className="notification">{notification}</div>
                )}
            </div>
        </div>
    );
}
