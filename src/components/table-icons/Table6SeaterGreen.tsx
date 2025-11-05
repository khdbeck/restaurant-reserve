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
                viewBox="0 0 300 350"
                fill="none"
                aria-hidden="true"
                {...props}
            >
        <rect
            width={58}
            height={54}
            x={8.5}
            y={102.5}
            fill="#00FF1E"
            stroke="#000"
            rx={14.5}
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
            height={8}
            x={14.5}
            y={158.5}
            fill="#00FF1E"
            stroke="#000"
            rx={4}
        />
        <rect
            width={46}
            height={4}
            x={0.5}
            y={151.5}
            fill="#00FF1E"
            stroke="#000"
            rx={2}
            transform="rotate(-90 .5 151.5)"
        />
        <rect
            width={4}
            height={8}
            x={0.5}
            y={151.5}
            fill="#00FF1E"
            stroke="#000"
            rx={2}
            transform="rotate(-90 .5 151.5)"
        />
        <rect
            width={4}
            height={8}
            x={0.5}
            y={109.5}
            fill="#00FF1E"
            stroke="#000"
            rx={2}
            transform="rotate(-90 .5 109.5)"
        />
        <rect
            width={58}
            height={54}
            x={8.5}
            y={190.5}
            fill="#00FF1E"
            stroke="#000"
            rx={14.5}
        />
        <rect
            width={46}
            height={8}
            x={14.5}
            y={180.5}
            fill="#00FF1E"
            stroke="#000"
            rx={4}
        />
        <rect
            width={46}
            height={8}
            x={14.5}
            y={246.5}
            fill="#00FF1E"
            stroke="#000"
            rx={4}
        />
        <rect
            width={46}
            height={4}
            x={0.5}
            y={239.5}
            fill="#00FF1E"
            stroke="#000"
            rx={2}
            transform="rotate(-90 .5 239.5)"
        />
        <rect
            width={4}
            height={8}
            x={0.5}
            y={239.5}
            fill="#00FF1E"
            stroke="#000"
            rx={2}
            transform="rotate(-90 .5 239.5)"
        />
        <rect
            width={4}
            height={8}
            x={0.5}
            y={197.5}
            fill="#00FF1E"
            stroke="#000"
            rx={2}
            transform="rotate(-90 .5 197.5)"
        />
        <rect
            width={58}
            height={54}
            x={116.5}
            y={345.5}
            fill="#00FF1E"
            stroke="#000"
            rx={14.5}
            transform="rotate(-90 116.5 345.5)"
        />
        <rect
            width={46}
            height={8}
            x={106.5}
            y={339.5}
            fill="#00FF1E"
            stroke="#000"
            rx={4}
            transform="rotate(-90 106.5 339.5)"
        />
        <rect
            width={46}
            height={8}
            x={172.5}
            y={339.5}
            fill="#00FF1E"
            stroke="#000"
            rx={4}
            transform="rotate(-90 172.5 339.5)"
        />
        <rect
            width={46}
            height={4}
            x={165.5}
            y={353.5}
            fill="#00FF1E"
            stroke="#000"
            rx={2}
            transform="rotate(-180 165.5 353.5)"
        />
        <rect
            width={4}
            height={8}
            x={165.5}
            y={353.5}
            fill="#00FF1E"
            stroke="#000"
            rx={2}
            transform="rotate(-180 165.5 353.5)"
        />
        <rect
            width={4}
            height={8}
            x={123.5}
            y={353.5}
            fill="#00FF1E"
            stroke="#000"
            rx={2}
            transform="rotate(-180 123.5 353.5)"
        />
        <rect
            width={58}
            height={54}
            x={275.5}
            y={156.5}
            fill="#00FF1E"
            stroke="#000"
            rx={14.5}
            transform="rotate(-180 275.5 156.5)"
        />
        <rect
            width={46}
            height={8}
            x={269.5}
            y={166.5}
            fill="#00FF1E"
            stroke="#000"
            rx={4}
            transform="rotate(-180 269.5 166.5)"
        />
        <rect
            width={46}
            height={8}
            x={269.5}
            y={100.5}
            fill="#00FF1E"
            stroke="#000"
            rx={4}
            transform="rotate(-180 269.5 100.5)"
        />
        <rect
            width={46}
            height={4}
            x={283.5}
            y={107.5}
            fill="#00FF1E"
            stroke="#000"
            rx={2}
            transform="rotate(90 283.5 107.5)"
        />
        <rect
            width={4}
            height={8}
            x={283.5}
            y={107.5}
            fill="#00FF1E"
            stroke="#000"
            rx={2}
            transform="rotate(90 283.5 107.5)"
        />
        <rect
            width={4}
            height={8}
            x={283.5}
            y={149.5}
            fill="#00FF1E"
            stroke="#000"
            rx={2}
            transform="rotate(90 283.5 149.5)"
        />
        <rect
            width={58}
            height={54}
            x={275.5}
            y={244.5}
            fill="#00FF1E"
            stroke="#000"
            rx={14.5}
            transform="rotate(-180 275.5 244.5)"
        />
        <rect
            width={46}
            height={8}
            x={269.5}
            y={254.5}
            fill="#00FF1E"
            stroke="#000"
            rx={4}
            transform="rotate(-180 269.5 254.5)"
        />
        <rect
            width={46}
            height={8}
            x={269.5}
            y={188.5}
            fill="#00FF1E"
            stroke="#000"
            rx={4}
            transform="rotate(-180 269.5 188.5)"
        />
        <rect
            width={46}
            height={4}
            x={283.5}
            y={195.5}
            fill="#00FF1E"
            stroke="#000"
            rx={2}
            transform="rotate(90 283.5 195.5)"
        />
        <rect
            width={4}
            height={8}
            x={283.5}
            y={195.5}
            fill="#00FF1E"
            stroke="#000"
            rx={2}
            transform="rotate(90 283.5 195.5)"
        />
        <rect
            width={4}
            height={8}
            x={283.5}
            y={237.5}
            fill="#00FF1E"
            stroke="#000"
            rx={2}
            transform="rotate(90 283.5 237.5)"
        />
        <rect
            width={58}
            height={54}
            x={169.5}
            y={8.5}
            fill="#00FF1E"
            stroke="#000"
            rx={14.5}
            transform="rotate(90 169.5 8.5)"
        />
        <rect
            width={46}
            height={8}
            x={179.5}
            y={14.5}
            fill="#00FF1E"
            stroke="#000"
            rx={4}
            transform="rotate(90 179.5 14.5)"
        />
        <rect
            width={46}
            height={8}
            x={113.5}
            y={14.5}
            fill="#00FF1E"
            stroke="#000"
            rx={4}
            transform="rotate(90 113.5 14.5)"
        />
        <rect
            width={46}
            height={4}
            x={120.5}
            y={0.5}
            fill="#00FF1E"
            stroke="#000"
            rx={2}
        />
        <rect
            width={4}
            height={8}
            x={120.5}
            y={0.5}
            fill="#00FF1E"
            stroke="#000"
            rx={2}
        />
        <rect
            width={4}
            height={8}
            x={162.5}
            y={0.5}
            fill="#00FF1E"
            stroke="#000"
            rx={2}
        />
        <rect
            width={58}
            height={54}
            x={169.5}
            y={8.5}
            fill="#00FF1E"
            stroke="#000"
            rx={14.5}
            transform="rotate(90 169.5 8.5)"
        />
        <rect
            width={46}
            height={8}
            x={179.5}
            y={14.5}
            fill="#00FF1E"
            stroke="#000"
            rx={4}
            transform="rotate(90 179.5 14.5)"
        />
        <rect
            width={46}
            height={8}
            x={113.5}
            y={14.5}
            fill="#00FF1E"
            stroke="#000"
            rx={4}
            transform="rotate(90 113.5 14.5)"
        />
        <rect
            width={46}
            height={4}
            x={120.5}
            y={0.5}
            fill="#00FF1E"
            stroke="#000"
            rx={2}
        />
        <rect
            width={4}
            height={8}
            x={120.5}
            y={0.5}
            fill="#00FF1E"
            stroke="#000"
            rx={2}
        />
        <rect
            width={4}
            height={8}
            x={162.5}
            y={0.5}
            fill="#00FF1E"
            stroke="#000"
            rx={2}
        />
        <rect
            width={129}
            height={199}
            x={77.5}
            y={77.5}
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
