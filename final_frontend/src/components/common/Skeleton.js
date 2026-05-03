import React from 'react';

const Skeleton = ({ width, height, borderRadius, style }) => {
  return (
    <div 
      className="skeleton"
      style={{ 
        width: width || '100%', 
        height: height || '20px', 
        borderRadius: borderRadius || '8px',
        ...style 
      }} 
    />
  );
};

export const CardSkeleton = () => (
  <div style={{ padding: '20px', background: 'var(--bg-secondary)', borderRadius: '20px', border: '1px solid var(--border-color)', marginBottom: '15px' }}>
    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
      <Skeleton width="50px" height="50px" borderRadius="12px" />
      <div style={{ flex: 1 }}>
        <Skeleton width="60%" height="18px" style={{ marginBottom: '8px' }} />
        <Skeleton width="40%" height="14px" />
      </div>
    </div>
    <Skeleton width="100%" height="12px" style={{ marginBottom: '8px' }} />
    <Skeleton width="90%" height="12px" />
  </div>
);

export const TableRowSkeleton = () => (
  <div style={{ display: 'flex', gap: '20px', padding: '15px', borderBottom: '1px solid var(--border-color)' }}>
    <Skeleton width="150px" height="20px" />
    <Skeleton width="100px" height="20px" />
    <Skeleton width="80px" height="20px" />
    <Skeleton width="120px" height="20px" />
    <Skeleton width="50px" height="20px" style={{ marginLeft: 'auto' }} />
  </div>
);

export default Skeleton;
