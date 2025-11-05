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
        <rect
            width={58}
            height={54}
            x={8.5}
            y={36.5}
            fill="#00FF1E"
            stroke="#000"
            rx={14.5}
        />
        <rect
            width={46}
            height={8}
            x={14.5}
            y={26.5}
            fill="#00FF1E"
            stroke="#000"
            rx={4}
        />
        <rect
            width={46}
            height={8}
            x={14.5}
            y={92.5}
            fill="#00FF1E"
            stroke="#000"
            rx={4}
        />
        <rect
            width={46}
            height={4}
            x={0.5}
            y={85.5}
            fill="#00FF1E"
            stroke="#000"
            rx={2}
            transform="rotate(-90 .5 85.5)"
        />
        <rect
            width={4}
            height={8}
            x={0.5}
            y={85.5}
            fill="#00FF1E"
            stroke="#000"
            rx={2}
            transform="rotate(-90 .5 85.5)"
        />
        <rect
            width={4}
            height={8}
            x={0.5}
            y={43.5}
            fill="#00FF1E"
            stroke="#000"
            rx={2}
            transform="rotate(-90 .5 43.5)"
        />
        <rect
            width={58}
            height={54}
            x={272.5}
            y={92.5}
            fill="#00FF1E"
            stroke="#000"
            rx={14.5}
            transform="rotate(-180 272.5 92.5)"
        />
        <rect
            width={46}
            height={8}
            x={266.5}
            y={102.5}
            fill="#00FF1E"
            stroke="#000"
            rx={4}
            transform="rotate(-180 266.5 102.5)"
        />
        <rect
            width={46}
            height={8}
            x={266.5}
            y={36.5}
            fill="#00FF1E"
            stroke="#000"
            rx={4}
            transform="rotate(-180 266.5 36.5)"
        />
        <rect
            width={46}
            height={4}
            x={280.5}
            y={43.5}
            fill="#00FF1E"
            stroke="#000"
            rx={2}
            transform="rotate(90 280.5 43.5)"
        />
        <rect
            width={4}
            height={8}
            x={280.5}
            y={43.5}
            fill="#00FF1E"
            stroke="#000"
            rx={2}
            transform="rotate(90 280.5 43.5)"
        />
        <rect
            width={4}
            height={8}
            x={280.5}
            y={85.5}
            fill="#00FF1E"
            stroke="#000"
            rx={2}
            transform="rotate(90 280.5 85.5)"
        />
        <rect
            width={129}
            height={129}
            x={75.5}
            y={0.5}
            fill="#20C200"
            stroke="#000"
            rx={19.5}
        />
    </svg>
        );
    }
);

Table4SeaterGreen.displayName = "Table4SeaterGreen";
export default Table4SeaterGreen;
