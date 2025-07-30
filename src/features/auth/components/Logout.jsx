import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAsync, selectLoggedInUser } from '../AuthSlice';
import { useNavigate } from 'react-router-dom';

export const Logout = () => {
    const dispatch = useDispatch();
    const loggedInUser = useSelector(selectLoggedInUser);
    const navigate = useNavigate();

    // Function to clear all cookies
    const clearCookies = () => {
        const cookies = document.cookie.split(';');
        cookies.forEach((cookie) => {
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
        });
    };

    useEffect(() => {
        // Dispatch logout action
        dispatch(logoutAsync());

        // Clear cookies
        clearCookies();
    }, [dispatch]);

    useEffect(() => {
        if (!loggedInUser) {
            navigate('/login');
        }
    }, [loggedInUser, navigate]);

    return <></>;
};
