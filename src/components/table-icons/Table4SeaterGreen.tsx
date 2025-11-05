import * as React from "react";

/**
 * Table4Seater icon (round table + 4 chairs).
 * - Default: GREEN (available)
 * - If `taken` is true: switches to RED (occupied)
 *
 * Usage:
 *   <Table4SeaterGreen />                    // green
 *   <Table4SeaterGreen taken />              // red
 *   <Table4SeaterGreen width={36} height={36} />
 */
type Props = React.SVGProps<SVGSVGElement> & {
        taken?: boolean;
};

const Table4SeaterGreen = React.forwardRef<SVGSVGElement, Props>(
    ({ taken = false, width = 281, height = 284, ...props }, ref) => {
            // Colors pulled from your Figma export:
            // Green table top:  #20C200 ; Green chairs:  #00FF1E
            // Red   table top:  #C20000 ; Red   chairs:  #FF0000
            const tableTop = taken ? "#C20000" : "#20C200";
            const chairFill = taken ? "#FF0000" : "#00FF1E";
            const chairEdge = "#000"; // stroke from Figma

            return (
                <svg
                    ref={ref}
                    xmlns="http://www.w3.org/2000/svg"
                    width={width}
                    height={height}
                    viewBox="0 0 281 284"
                    fill="none"
                    aria-hidden="true"
                    {...props}
                >
                        {/* Table top */}
                        <path
                            fill={tableTop}
                            stroke="#000"
                            d="M140.5 77.5c35.343 0 64 28.874 64 64.5 0 35.626-28.657 64.5-64 64.5s-64-28.874-64-64.5c0-35.626 28.657-64.5 64-64.5Z"
                        />

                        {/* === LEFT chair group === */}
                        <rect width={58} height={54} x={8.5} y={113.5} fill={chairFill} stroke={chairEdge} rx={14.5} />
                        <rect width={46} height={8}  x={14.5} y={103.5} fill={chairFill} stroke={chairEdge} rx={4} />
                        <rect width={46} height={8}  x={14.5} y={169.5} fill={chairFill} stroke={chairEdge} rx={4} />
                        <rect width={46} height={4}  x={0.5}  y={162.5} fill={chairFill} stroke={chairEdge} rx={2} transform="rotate(-90 .5 162.5)" />
                        <rect width={4}  height={8}  x={0.5}  y={162.5} fill={chairFill} stroke={chairEdge} rx={2} transform="rotate(-90 .5 162.5)" />
                        <rect width={4}  height={8}  x={0.5}  y={120.5} fill={chairFill} stroke={chairEdge} rx={2} transform="rotate(-90 .5 120.5)" />

                        {/* === TOP chair group === */}
                        <rect width={58} height={54} x={167.5} y={8.5}  fill={chairFill} stroke={chairEdge} rx={14.5} transform="rotate(90 167.5 8.5)" />
                        <rect width={46} height={8}  x={177.5} y={14.5} fill={chairFill} stroke={chairEdge} rx={4} transform="rotate(90 177.5 14.5)" />
                        <rect width={46} height={8}  x={111.5} y={14.5} fill={chairFill} stroke={chairEdge} rx={4} transform="rotate(90 111.5 14.5)" />
                        <rect width={46} height={4}  x={118.5} y={0.5}  fill={chairFill} stroke={chairEdge} rx={2} />
                        <rect width={4}  height={8}  x={118.5} y={0.5}  fill={chairFill} stroke={chairEdge} rx={2} />
                        <rect width={4}  height={8}  x={160.5} y={0.5}  fill={chairFill} stroke={chairEdge} rx={2} />

                        {/* === RIGHT chair group === */}
                        <rect width={58} height={54} x={272.5} y={169.5} fill={chairFill} stroke={chairEdge} rx={14.5} transform="rotate(-180 272.5 169.5)" />
                        <rect width={46} height={8}  x={266.5} y={179.5} fill={chairFill} stroke={chairEdge} rx={4} transform="rotate(-180 266.5 179.5)" />
                        <rect width={46} height={8}  x={266.5} y={113.5} fill={chairFill} stroke={chairEdge} rx={4} transform="rotate(-180 266.5 113.5)" />
                        <rect width={46} height={4}  x={280.5} y={120.5} fill={chairFill} stroke={chairEdge} rx={2} transform="rotate(90 280.5 120.5)" />
                        <rect width={4}  height={8}  x={280.5} y={120.5} fill={chairFill} stroke={chairEdge} rx={2} transform="rotate(90 280.5 120.5)" />
                        <rect width={4}  height={8}  x={280.5} y={162.5} fill={chairFill} stroke={chairEdge} rx={2} transform="rotate(90 280.5 162.5)" />

                        {/* === BOTTOM chair group === */}
                        <rect width={58} height={54} x={113.5} y={275.5} fill={chairFill} stroke={chairEdge} rx={14.5} transform="rotate(-90 113.5 275.5)" />
                        <rect width={46} height={8}  x={103.5} y={269.5} fill={chairFill} stroke={chairEdge} rx={4} transform="rotate(-90 103.5 269.5)" />
                        <rect width={46} height={8}  x={169.5} y={269.5} fill={chairFill} stroke={chairEdge} rx={4} transform="rotate(-90 169.5 269.5)" />
                        <rect width={46} height={4}  x={162.5} y={283.5} fill={chairFill} stroke={chairEdge} rx={2} transform="rotate(-180 162.5 283.5)" />
                        <rect width={4}  height={8}  x={162.5} y={283.5} fill={chairFill} stroke={chairEdge} rx={2} transform="rotate(-180 162.5 283.5)" />
                        <rect width={4}  height={8}  x={120.5} y={283.5} fill={chairFill} stroke={chairEdge} rx={2} transform="rotate(-180 120.5 283.5)" />
                </svg>
            );
    }
);

Table4SeaterGreen.displayName = "Table4SeaterGreen";
export default Table4SeaterGreen;
