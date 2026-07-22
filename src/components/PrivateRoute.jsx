import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '../lib/authClient.js';
import Spinner from './Spinner.jsx';

export default function PrivateRoute({ children }) {
  const { data, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Spinner />
      </div>
    );
  }
  if (!data?.user) return <Navigate to="/signin" replace />;
  return children;
}
