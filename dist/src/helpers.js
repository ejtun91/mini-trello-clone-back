"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessage = void 0;
const getErrorMessage = (err) => {
    return err instanceof Error ? err.message : String(err);
};
exports.getErrorMessage = getErrorMessage;
//# sourceMappingURL=helpers.js.map