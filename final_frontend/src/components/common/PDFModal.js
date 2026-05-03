import React from 'react';
import { FiX, FiExternalLink, FiDownload } from 'react-icons/fi';

const PDFModal = ({ isOpen, onClose, fileUrl, fileName }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      backdropFilter: 'blur(4px)'
    }} onClick={onClose}>
      <div style={{
        width: '90%',
        height: '90%',
        background: 'var(--bg-secondary)',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {fileName || 'PDF Viewer'}
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a href={fileUrl} target="_blank" rel="noreferrer" style={{
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <FiExternalLink /> Open in Tab
            </a>
            <button onClick={onClose} style={{
              background: 'var(--bg-tertiary)',
              border: 'none',
              color: 'var(--text-primary)',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}>
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, background: '#525659' }}>
          <iframe 
            src={`${fileUrl}#toolbar=0`} 
            width="100%" 
            height="100%" 
            style={{ border: 'none' }}
            title={fileName}
          />
        </div>
      </div>
    </div>
  );
};

export default PDFModal;
