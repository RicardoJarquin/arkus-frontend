import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosClient from '../axios-client.js';
import { useStateContext } from '../context/ContextProvider.jsx';

export default function AccountUsers() {
    const { accountId } = useParams();
    const [name, setName] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext();

    const getAccountUsers = () => {
        setLoading(true);
        axiosClient
            .get(`/account/${accountId}/users`)
            .then(({ data }) => {
                setLoading(false);
                setUsers(data.users);
                setName(data.name);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getAccountUsers();
    }, []);

    const onDeleteClick = (user) => {
        if (!window.confirm('Are you sure you want to delete this account?')) {
            return;
        }
        axiosClient
            .delete(`/account/users/${user.id}/${accountId}`)
            .then(() => {
                setNotification('Account was successfully deleted');
                getAccountUsers();
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
                <h1>Users for account: {name}</h1>
                <Link
                    className="btn-add"
                    to={`/accounts/${accountId}/users/new`}
                >
                    Add new
                </Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
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
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.created_at}</td>
                                    <td>
                                        <Link
                                            className="btn-edit"
                                            to={`/accounts/${accountId}/users/${u.id}`}
                                        >
                                            Edit
                                        </Link>
                                        &nbsp;
                                        <button
                                            className="btn-delete"
                                            onClick={(ev) => onDeleteClick(u)}
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
