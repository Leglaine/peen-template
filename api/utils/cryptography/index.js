const bcrypt = require("bcrypt");

exports.hashPassword = async password => {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
};

exports.verifyPassword = async (password, hash) => {
    const isVerified = await bcrypt.compare(password, hash);
    return isVerified;
};
