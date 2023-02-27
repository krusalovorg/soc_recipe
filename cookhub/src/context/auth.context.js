import {createContext} from 'react';

function noop() {}

export const AuthContext = createContext({
    token: null,
    userId: null,
    // login: noop,
    logout: noop,
    checkLogin: noop,
    isAuthenticated: false,
})

export const UserContext = createContext({
    name: null,
    surname: null,
    email: null,
    tag: null,
    user_id: null,
    likes: null,
    recipes: [],
    setUser: noop
})