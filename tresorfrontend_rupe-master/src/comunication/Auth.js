export const getToken = () => {
    return localStorage.getItem('token');
};

export const getUsername = () => {
    return localStorage.getItem('username');
}

export const getRole = () => {
    return localStorage.getItem('role');
}

export const getFullname = () => {
    return localStorage.getItem('fullname');
}

export const getUserId = () => {
    return localStorage.getItem('userId');
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('fullname');
    localStorage.removeItem('userId');
}; 