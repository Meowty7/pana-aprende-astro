import React, { useEffect, useState } from 'react';

const ClientOnlyComponent = ({ onUserIdChange }) => {
    const [userId, setUserId] = useState('');


    const query = new URLSearchParams(window.location.search);
    const id = query.get('userId');
    setUserId(id);
    onUserIdChange(id);
   

    return userId; // This component does not render anything
};

export default ClientOnlyComponent;