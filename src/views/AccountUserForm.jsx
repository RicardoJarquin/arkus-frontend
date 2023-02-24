import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosClient from '../axios-client.js';
import { useStateContext } from '../context/ContextProvider.jsx';

export default function AccountUserForm() {
    const navigate = useNavigate();
    const { accountId, userId } = useParams();
    const [users, setUsers] = useState([]);
    const [accountUser, setAccountUser] = useState({
        user_id: '',
        start_date: null,
        end_date: null,
        account_id: accountId,
    });
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext();

    useEffect(() => {
        setLoading(true);
        axiosClient
            .get(`/users`)
            .then(({ data }) => {
                setLoading(false);
                setUsers(data.data);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    if (userId) {
        useEffect(() => {
            setLoading(true);
            axiosClient
                .get(`/account/users/${userId}`)
                .then(({ data }) => {
                    setLoading(false);
                    setAccountUser(data);
                })
                .catch(() => {
                    setLoading(false);
                });
        }, []);
    }

    const onSubmit = (ev) => {
        ev.preventDefault();
        if (accountId) {
            axiosClient
                .put(`/account/users`, accountUser)
                .then(() => {
                    setNotification('Account was successfully updated');
                    navigate('/accounts');
                })
                .catch((err) => {
                    const { response } = err;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        } else {
            axiosClient
                .post('/account/users', accountUser)
                .then(() => {
                    setNotification('Account was successfully created');
                    navigate('/accounts');
                })
                .catch((err) => {
                    const { response } = err;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        }
    };

    return (
        <>
            {userId && <h1>Update Account User</h1>}
            {!userId && <h1>New Account User</h1>}
            <div className="card animated fadeInDown">
                {loading && <div className="text-center">Loading...</div>}
                {errors && (
                    <div className="alert">
                        {Object.keys(errors).map((key) => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                )}
                {!loading && (
                    <form onSubmit={onSubmit}>
                        <select
                            value={accountUser.user_id}
                            onChange={(ev) =>
                                setAccountUser({
                                    ...accountUser,
                                    user_id: ev.target.value,
                                })
                            }
                            placeholder="User"
                        >
                            <option value="">Select a user</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="date"
                            value={accountUser.start_date}
                            onChange={(ev) =>
                                setAccountUser({
                                    ...accountUser,
                                    start_date: ev.target.value,
                                })
                            }
                            placeholder="Start Date"
                        />
                        <input
                            type="date"
                            value={accountUser.end_date}
                            onChange={(ev) =>
                                setAccountUser({
                                    ...accountUser,
                                    end_date: ev.target.value,
                                })
                            }
                            placeholder="End Date"
                        />
                        <button className="btn">Save</button>
                    </form>
                )}
            </div>
        </>
    );
}
