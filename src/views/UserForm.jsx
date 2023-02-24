import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosClient from '../axios-client.js';
import { useStateContext } from '../context/ContextProvider.jsx';

export default function UserForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [user, setUser] = useState({
        id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        english_level: '',
        technical_skills: '',
        cv_link: '',
        is_admin: false,
        is_super_admin: false,
    });
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext();

    if (id) {
        useEffect(() => {
            setLoading(true);
            axiosClient
                .get(`/users/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setUser(data);
                })
                .catch(() => {
                    setLoading(false);
                });
        }, []);
    }

    const onSubmit = (ev) => {
        ev.preventDefault();
        if (user.id) {
            axiosClient
                .put(`/users/${user.id}`, user)
                .then(() => {
                    setNotification('User was successfully updated');
                    navigate('/users');
                })
                .catch((err) => {
                    const { response } = err;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        } else {
            axiosClient
                .post('/users', user)
                .then(() => {
                    setNotification('User was successfully created');
                    navigate('/users');
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
            {user.id && <h1>Update User: {user.name}</h1>}
            {!user.id && <h1>New User</h1>}
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
                            value={user.name}
                            onChange={(ev) =>
                                setUser({ ...user, name: ev.target.value })
                            }
                            placeholder="Name"
                        />
                        <input
                            value={user.email}
                            onChange={(ev) =>
                                setUser({ ...user, email: ev.target.value })
                            }
                            placeholder="Email"
                        />
                        <input
                            type="password"
                            onChange={(ev) =>
                                setUser({ ...user, password: ev.target.value })
                            }
                            placeholder="Password"
                        />
                        <input
                            type="password"
                            onChange={(ev) =>
                                setUser({
                                    ...user,
                                    password_confirmation: ev.target.value,
                                })
                            }
                            placeholder="Password Confirmation"
                        />
                        <select
                            value={user.english_level}
                            onChange={(ev) =>
                                setUser({
                                    ...user,
                                    english_level: ev.target.value,
                                })
                            }
                            placeholder="English Level"
                        >
                            {' '}
                            <option value="basic">Basic</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        <input
                            value={user.technical_skills}
                            onChange={(ev) =>
                                setUser({
                                    ...user,
                                    technical_skills: ev.target.value,
                                })
                            }
                            placeholder="Technical Skills"
                        />
                        <input
                            value={user.cv_link}
                            onChange={(ev) =>
                                setUser({ ...user, cv_link: ev.target.value })
                            }
                            placeholder="CV Link"
                        />
                        {user.is_super_admin && (
                            <label htmlFor="is_dmin">
                                Is admin
                                <input
                                    id="is_dmin"
                                    type="checkbox"
                                    value={user.is_admin}
                                    checked={user.is_admin}
                                    onChange={(ev) =>
                                        setUser({
                                            ...user,
                                            is_admin: ev.target.checked,
                                        })
                                    }
                                />
                            </label>
                        )}
                        <button className="btn">Save</button>
                    </form>
                )}
            </div>
        </>
    );
}
