import React from 'react';

const RoleGuard = ({ children, roles }) => {
  // Mock user for template
  const user = { role: 'HOSPITAL' };

  if (!roles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};

export default RoleGuard;
