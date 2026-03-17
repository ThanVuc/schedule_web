export class DateOnly {
  readonly year: number;
  readonly month: number;
  readonly day: number;

  private constructor(year: number, month: number, day: number) {
    this.year = year;
    this.month = month;
    this.day = day;
  }

  // ===== CREATE =====
  static fromString(value: string): DateOnly {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new Error("Invalid format. Expected YYYY-MM-DD");
    }

    const [year, month, day] = value.split("-").map(Number);

    const d = new Date(year, month - 1, day);

    // Validate real date (e.g. reject 2026-02-31)
    if (
      d.getFullYear() !== year ||
      d.getMonth() !== month - 1 ||
      d.getDate() !== day
    ) {
      throw new Error("Invalid calendar date");
    }

    return new DateOnly(year, month, day);
  }

  static fromDate(date: Date): DateOnly {
    return new DateOnly(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );
  }

  // ===== FORMAT =====
  toString(): string {
    const mm = String(this.month).padStart(2, "0");
    const dd = String(this.day).padStart(2, "0");
    return `${this.year}-${mm}-${dd}`;
  }

  // ===== INTERNAL JS DATE (SAFE) =====
  private toJSDate(): Date {
    return new Date(this.year, this.month - 1, this.day);
  }

  // ===== COMPARE =====
  isBefore(other: DateOnly): boolean {
    return this.toJSDate().getTime() < other.toJSDate().getTime();
  }

  isAfter(other: DateOnly): boolean {
    return this.toJSDate().getTime() > other.toJSDate().getTime();
  }

  equals(other: DateOnly): boolean {
    return this.toString() === other.toString();
  }

  // ===== DIFF (days) =====
  diffInDays(other: DateOnly): number {
    const ms =
      this.toJSDate().getTime() - other.toJSDate().getTime();
    return Math.floor(ms / (1000 * 60 * 60 * 24));
  }
}
