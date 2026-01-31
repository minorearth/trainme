"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signOutUserRep = exports.resetPsw = exports.createUser = exports.launchAuthStateChangeMonitor = exports.signInUser = void 0;
const CA_1 = require("../../DB/FB/CA");
const errorHandlers_1 = require("../../errorHandlers");
const signInUser = async ({ email, password, }) => {
    try {
        await (0, CA_1.signInUserDB)({ email, password });
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.signInUser = signInUser;
const launchAuthStateChangeMonitor = async (action) => {
    try {
        return await (0, CA_1.launchAuthStateChangeMonitorDB)(action);
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.launchAuthStateChangeMonitor = launchAuthStateChangeMonitor;
const createUser = async ({ email, password, }) => {
    try {
        return await (0, CA_1.createUserDB)({
            email,
            password,
        });
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.createUser = createUser;
const resetPsw = async (email) => {
    try {
        await (0, CA_1.resetPswDB)(email);
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.resetPsw = resetPsw;
const signOutUserRep = async () => {
    try {
        await (0, CA_1.signOutUserDB)();
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.signOutUserRep = signOutUserRep;
//# sourceMappingURL=repositoryFBAuth.js.map