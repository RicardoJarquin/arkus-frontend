import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../axios-client.js';
import { useStateContext } from '../context/ContextProvider.jsx';

export default function Accounts() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext();

    const getAccounts = () => {
        setLoading(true);
        axiosClient
            .get('/accounts')
            .then(({ data }) => {
                setLoading(false);
                setAccounts(data.data);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getAccounts();
    }, []);

    const onDeleteClick = (account) => {
        if (!window.confirm('Are you sure you want to delete this account?')) {
            return;
        }
        axiosClient.delete(`/account/${account.id}`).then(() => {
            setNotification('Account was successfully deleted');
            getAccounts();
        });
    };

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <h1>Accounts</h1>
                <Link className="btn-add" to="/accounts/new">
                    Add new
                </Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Client Name</th>
                            <th>Person In Changer</th>
                            <th>Create Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {loading && (
                        <tbody>
                            <tr>
                                <td colSpan="5" className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        </tbody>
                    )}
                    {!loading && (
                        <tbody>
                            {accounts.map((a) => (
                                <tr key={a.id}>
                                    <td>{a.id}</td>
                                    <td>{a.name}</td>
                                    <td>{a.client_name}</td>
                                    <td>{a.person_in_charge}</td>
                                    <td>{a.created_at}</td>
                                    <td>
                                        <Link
                                            className="btn-group"
                                            to={`/accounts/${a.id}/users`}
                                        >
                                            Group
                                        </Link>
                                        &nbsp;
                                        <Link
                                            className="btn-edit"
                                            to={`/accounts/${a.id}`}
                                        >
                                            Edit
                                        </Link>
                                        &nbsp;
                                        <button
                                            className="btn-delete"
                                            onClick={(ev) => onDeleteClick(a)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>
            </div>
        </div>
    );
}
