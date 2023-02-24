import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosClient from '../axios-client.js';
import { useStateContext } from '../context/ContextProvider.jsx';

export default function AccountForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [account, setAccount] = useState({
        id: null,
        name: '',
        client_name: '',
        person_in_charge: '',
    });
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext();

    if (id) {
        useEffect(() => {
            setLoading(true);
            axiosClient
                .get(`/accounts/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setAccount(data);
                })
                .catch(() => {
                    setLoading(false);
                });
        }, []);
    }

    const onSubmit = (ev) => {
        ev.preventDefault();
        if (account.id) {
            axiosClient
                .put(`/accounts/${account.id}`, account)
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
                .post('/accounts', account)
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
            {account.id && <h1>Update Account: {account.name}</h1>}
            {!account.id && <h1>New Account</h1>}
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
                        <input
                            value={account.name}
                            onChange={(ev) =>
                                setAccount({
                                    ...account,
                                    name: ev.target.value,
                                })
                            }
                            placeholder="Name"
                        />
                        <input
                            value={account.client_name}
                            onChange={(ev) =>
                                setAccount({
                                    ...account,
                                    client_name: ev.target.value,
                                })
                            }
                            placeholder="Client Name"
                        />
                        <input
                            value={account.person_in_charge}
                            onChange={(ev) =>
                                setAccount({
                                    ...account,
                                    person_in_charge: ev.target.value,
                                })
                            }
                            placeholder="Person in charge"
                        />
                        <button className="btn">Save</button>
                    </form>
                )}
            </div>
        </>
    );
}
