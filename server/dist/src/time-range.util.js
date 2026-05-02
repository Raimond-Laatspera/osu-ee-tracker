"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateRange = getDateRange;
function getDateRange(period) {
    const now = new Date();
    switch (period) {
        case 'daily':
            return new Date(now.setDate(now.getDate() - 1));
        case 'weekly':
            return new Date(now.setDate(now.getDate() - 7));
        case 'monthly':
            return new Date(now.setMonth(now.getMonth() - 1));
        default:
            return undefined;
    }
}
//# sourceMappingURL=time-range.util.js.map