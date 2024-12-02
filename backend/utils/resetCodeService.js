const resetCodeMap = new Map(); 

const generateCode = (length = 6) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
};

const setResetCode = (email) => {
    const code = generateCode(); 
    resetCodeMap.set(email, { code, expires: Date.now() + 10 * 60 * 1000 });
    return code;
};

const verifyResetCode = (email, code) => {
    const data = resetCodeMap.get(email);
    if (!data) return false;

    if (data.code === code && Date.now() < data.expires) {
        resetCodeMap.delete(email); 
        return true;
    }
    return false;
};

module.exports = { setResetCode, verifyResetCode };
