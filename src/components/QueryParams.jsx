// src/components/QueryParamReader.jsx
import { useLocation } from 'react-router-dom'; // Ensure you have react-router installed

const QueryParamReader = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const userId = queryParams.get('userId');

  return (
    <div>
      <p>User ID: {userId}</p>
    </div>
  );
};

export default QueryParamReader;
