import { of, EMPTY } from 'rxjs';
export class ChangeFilter {
    constructor(changes) {
        this.changes = changes;
    }
    static of(changes) {
        return new ChangeFilter(changes);
    }
    notEmpty(key) {
        if (this.changes[key]) {
            const value = this.changes[key].currentValue;
            if (value !== undefined && value !== null) {
                return of(value);
            }
        }
        return EMPTY;
    }
    has(key) {
        if (this.changes[key]) {
            const value = this.changes[key].currentValue;
            return of(value);
        }
        return EMPTY;
    }
    notFirst(key) {
        if (this.changes[key] && !this.changes[key].isFirstChange()) {
            const value = this.changes[key].currentValue;
            return of(value);
        }
        return EMPTY;
    }
    notFirstAndEmpty(key) {
        if (this.changes[key] && !this.changes[key].isFirstChange()) {
            const value = this.changes[key].currentValue;
            if (value !== undefined && value !== null) {
                return of(value);
            }
        }
        return EMPTY;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlLWZpbHRlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1lY2hhcnRzLyIsInNvdXJjZXMiOlsibGliL2NoYW5nZS1maWx0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFjLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFN0MsTUFBTSxPQUFPLFlBQVk7SUFDdkIsWUFBb0IsT0FBc0I7UUFBdEIsWUFBTyxHQUFQLE9BQU8sQ0FBZTtJQUFJLENBQUM7SUFFL0MsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFzQjtRQUM5QixPQUFPLElBQUksWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRCxRQUFRLENBQUksR0FBVztRQUNyQixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDckIsTUFBTSxLQUFLLEdBQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUM7WUFFaEQsSUFBSSxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7Z0JBQ3pDLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ2xCO1NBQ0Y7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCxHQUFHLENBQUksR0FBVztRQUNoQixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDckIsTUFBTSxLQUFLLEdBQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUM7WUFDaEQsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDbEI7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCxRQUFRLENBQUksR0FBVztRQUNyQixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGFBQWEsRUFBRSxFQUFFO1lBQzNELE1BQU0sS0FBSyxHQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDO1lBQ2hELE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2xCO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsZ0JBQWdCLENBQUksR0FBVztRQUM3QixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGFBQWEsRUFBRSxFQUFFO1lBQzNELE1BQU0sS0FBSyxHQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDO1lBRWhELElBQUksS0FBSyxLQUFLLFNBQVMsSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO2dCQUN6QyxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNsQjtTQUNGO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiwgRU1QVFkgfSBmcm9tICdyeGpzJztcblxuZXhwb3J0IGNsYXNzIENoYW5nZUZpbHRlciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2hhbmdlczogU2ltcGxlQ2hhbmdlcykgeyB9XG5cbiAgc3RhdGljIG9mKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICByZXR1cm4gbmV3IENoYW5nZUZpbHRlcihjaGFuZ2VzKTtcbiAgfVxuXG4gIG5vdEVtcHR5PFQ+KGtleTogc3RyaW5nKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgaWYgKHRoaXMuY2hhbmdlc1trZXldKSB7XG4gICAgICBjb25zdCB2YWx1ZTogVCA9IHRoaXMuY2hhbmdlc1trZXldLmN1cnJlbnRWYWx1ZTtcblxuICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG9mKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIEVNUFRZO1xuICB9XG5cbiAgaGFzPFQ+KGtleTogc3RyaW5nKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgaWYgKHRoaXMuY2hhbmdlc1trZXldKSB7XG4gICAgICBjb25zdCB2YWx1ZTogVCA9IHRoaXMuY2hhbmdlc1trZXldLmN1cnJlbnRWYWx1ZTtcbiAgICAgIHJldHVybiBvZih2YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiBFTVBUWTtcbiAgfVxuXG4gIG5vdEZpcnN0PFQ+KGtleTogc3RyaW5nKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgaWYgKHRoaXMuY2hhbmdlc1trZXldICYmICF0aGlzLmNoYW5nZXNba2V5XS5pc0ZpcnN0Q2hhbmdlKCkpIHtcbiAgICAgIGNvbnN0IHZhbHVlOiBUID0gdGhpcy5jaGFuZ2VzW2tleV0uY3VycmVudFZhbHVlO1xuICAgICAgcmV0dXJuIG9mKHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIEVNUFRZO1xuICB9XG5cbiAgbm90Rmlyc3RBbmRFbXB0eTxUPihrZXk6IHN0cmluZyk6IE9ic2VydmFibGU8VD4ge1xuICAgIGlmICh0aGlzLmNoYW5nZXNba2V5XSAmJiAhdGhpcy5jaGFuZ2VzW2tleV0uaXNGaXJzdENoYW5nZSgpKSB7XG4gICAgICBjb25zdCB2YWx1ZTogVCA9IHRoaXMuY2hhbmdlc1trZXldLmN1cnJlbnRWYWx1ZTtcblxuICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG9mKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIEVNUFRZO1xuICB9XG59XG4iXX0=