import React from 'react';
import dynamic from 'next/dynamic';

const Login = dynamic(() => import('../components/FirebaseAuthComponents/login'), { ssr: false });

const LoginPage: React.FC = () => {
  return (
    <>

    <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
      <div style={{ width: '320px', backgroundColor: '#fff', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h3 style={{textAlign: 'center'}}>Login</h3>
        <Login />
      </div>
    </div>
    </>
  );
};

export default LoginPage;



