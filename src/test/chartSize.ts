// Recharts' ResponsiveContainer measures its box, which happy-dom lays out
// as 0×0. Call in beforeEach so charts render at a real size; other
// elements (legends, tooltips) keep their own, empty, measurements.
// Captured once at import: a spy left from an earlier test must not
// become the "original" of the next one.
const nativeRect = HTMLElement.prototype.getBoundingClientRect;

export function mockChartSize(width = 480, height = 300) {
    return vi
        .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
        .mockImplementation(function (this: HTMLElement) {
            if (!this.classList.contains('recharts-responsive-container')) {
                return nativeRect.call(this);
            }
            return {
                width,
                height,
                top: 0,
                left: 0,
                right: width,
                bottom: height,
                x: 0,
                y: 0,
                toJSON: () => ({}),
            };
        });
}
