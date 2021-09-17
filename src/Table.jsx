import React from 'react';

const Table = ({children}) => {
  return <div style={{
    width: '100%',
    height: '100%',
    backgroundColor: '#f6a9cd',
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem 2rem',
    boxSizing: 'border-box'
  }}>
    {children}
  </div>
}

export default Table
