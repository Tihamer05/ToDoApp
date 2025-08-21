const generateAdminReport = (user, data) => {
    if (!user || !data) return null;

    const timestamp = new Date().toISOString();

    return {
        type: 'admin',
        user: user.name,
        createdAt: timestamp,
        source: 'dashboard',
        data: {
            id: data.id,
            payload: JSON.stringify(data.payload),
            notes: data.notes ? data.notes.toUpperCase() : '',
        },
        accessLevel: user.role,
    };
};

const generateCustomerReport = (user, data) => {
    if (!user || !data) return null;

    const timestamp = new Date().toISOString();

    return {
        type: 'customer',
        user: user.name,
        createdAt: timestamp,
        source: 'portal',
        data: {
            id: data.id,
            payload: JSON.stringify(data.payload),
            notes: data.notes || '',
        },
        membership: user.status,
    };
};