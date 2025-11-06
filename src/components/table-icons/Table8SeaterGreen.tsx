import * as React from "react";

type Props = React.SVGProps<SVGSVGElement> & {
    taken?: boolean;
};

const Table8SeaterGreen = React.forwardRef<SVGSVGElement, Props>(
    ({ taken = false, width = 281, height = 284, ...props }, ref) => {

        const tableTop = taken ? "#C20000" : "#20C200";
        const chairFill = taken ? "#FF0000" : "#00FF1E";
        const chairEdge = "#000";

        return (<svg
        width={325}
        height={325}
        viewBox="0 0 325 325"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <circle cx={162} cy={162} r={79.5} fill="#20C200" stroke="black" />
        <rect
            x={8.5}
            y={134.5}
            width={58}
            height={54}
            rx={14.5}
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={14.5}
            y={124.5}
            width={46}
            height={8}
            rx={4}
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={14.5}
            y={190.5}
            width={46}
            height={8}
            rx={4}
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={0.5}
            y={183.5}
            width={46}
            height={4}
            rx={2}
            transform="rotate(-90 0.5 183.5)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={0.5}
            y={183.5}
            width={4}
            height={8}
            rx={2}
            transform="rotate(-90 0.5 183.5)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={0.5}
            y={141.5}
            width={4}
            height={8}
            rx={2}
            transform="rotate(-90 0.5 141.5)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={132.5}
            y={316.5}
            width={58}
            height={54}
            rx={14.5}
            transform="rotate(-90 132.5 316.5)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={122.5}
            y={310.5}
            width={46}
            height={8}
            rx={4}
            transform="rotate(-90 122.5 310.5)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={188.5}
            y={310.5}
            width={46}
            height={8}
            rx={4}
            transform="rotate(-90 188.5 310.5)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={181.5}
            y={324.5}
            width={46}
            height={4}
            rx={2}
            transform="rotate(-180 181.5 324.5)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={181.5}
            y={324.5}
            width={4}
            height={8}
            rx={2}
            transform="rotate(-180 181.5 324.5)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={139.5}
            y={324.5}
            width={4}
            height={8}
            rx={2}
            transform="rotate(-180 139.5 324.5)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={316.5}
            y={188.5}
            width={58}
            height={54}
            rx={14.5}
            transform="rotate(-180 316.5 188.5)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={310.5}
            y={198.5}
            width={46}
            height={8}
            rx={4}
            transform="rotate(-180 310.5 198.5)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={310.5}
            y={132.5}
            width={46}
            height={8}
            rx={4}
            transform="rotate(-180 310.5 132.5)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={324.5}
            y={139.5}
            width={46}
            height={4}
            rx={2}
            transform="rotate(90 324.5 139.5)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={324.5}
            y={139.5}
            width={4}
            height={8}
            rx={2}
            transform="rotate(90 324.5 139.5)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={324.5}
            y={181.5}
            width={4}
            height={8}
            rx={2}
            transform="rotate(90 324.5 181.5)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={186.5}
            y={8.5}
            width={58}
            height={54}
            rx={14.5}
            transform="rotate(90 186.5 8.5)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={196.5}
            y={14.5}
            width={46}
            height={8}
            rx={4}
            transform="rotate(90 196.5 14.5)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={130.5}
            y={14.5}
            width={46}
            height={8}
            rx={4}
            transform="rotate(90 130.5 14.5)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={137.5}
            y={0.5}
            width={46}
            height={4}
            rx={2}
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={137.5}
            y={0.5}
            width={4}
            height={8}
            rx={2}
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={179.5}
            y={0.5}
            width={4}
            height={8}
            rx={2}
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={60.9914}
            y={33.435}
            width={58}
            height={54}
            rx={14.5}
            transform="rotate(45 60.9914 33.435)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={72.3051}
            y={30.6066}
            width={46}
            height={8}
            rx={4}
            transform="rotate(45 72.3051 30.6066)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={25.7341}
            y={78.1188}
            width={46}
            height={8}
            rx={4}
            transform="rotate(45 25.7341 78.1188)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={20.6863}
            y={62.4264}
            width={46}
            height={4}
            rx={2}
            transform="rotate(-45 20.6863 62.4264)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={20.6863}
            y={62.4264}
            width={4}
            height={8}
            rx={2}
            transform="rotate(-45 20.6863 62.4264)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={50.3848}
            y={32.7279}
            width={4}
            height={8}
            rx={2}
            transform="rotate(-45 50.3848 32.7279)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={292.048}
            y={68.6924}
            width={58}
            height={54}
            rx={14.5}
            transform="rotate(135 292.048 68.6924)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={294.876}
            y={80.006}
            width={46}
            height={8}
            rx={4}
            transform="rotate(135 294.876 80.006)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={246.962}
            y={34.435}
            width={46}
            height={8}
            rx={4}
            transform="rotate(135 246.962 34.435)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={263.056}
            y={28.3873}
            width={46}
            height={4}
            rx={2}
            transform="rotate(45 263.056 28.3873)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={263.056}
            y={28.3873}
            width={4}
            height={8}
            rx={2}
            transform="rotate(45 263.056 28.3873)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={292.755}
            y={58.0858}
            width={4}
            height={8}
            rx={2}
            transform="rotate(45 292.755 58.0858)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={30.435}
            y={250.79}
            width={58}
            height={54}
            rx={14.5}
            transform="rotate(-45 30.435 250.79)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={27.6066}
            y={239.477}
            width={46}
            height={8}
            rx={4}
            transform="rotate(-45 27.6066 239.477)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={74.1188}
            y={286.646}
            width={46}
            height={8}
            rx={4}
            transform="rotate(-45 74.1188 286.646)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={59.4264}
            y={291.095}
            width={46}
            height={4}
            rx={2}
            transform="rotate(-135 59.4264 291.095)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={59.4264}
            y={291.095}
            width={4}
            height={8}
            rx={2}
            transform="rotate(-135 59.4264 291.095)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={29.7279}
            y={261.397}
            width={4}
            height={8}
            rx={2}
            transform="rotate(-135 29.7279 261.397)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={256.548}
            y={291.977}
            width={58}
            height={54}
            rx={14.5}
            transform="rotate(-135 256.548 291.977)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={245.234}
            y={294.805}
            width={46}
            height={8}
            rx={4}
            transform="rotate(-135 245.234 294.805)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={292.403}
            y={247.891}
            width={46}
            height={8}
            rx={4}
            transform="rotate(-135 292.403 247.891)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={296.853}
            y={262.985}
            width={46}
            height={4}
            rx={2}
            transform="rotate(135 296.853 262.985)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={296.853}
            y={262.985}
            width={4}
            height={8}
            rx={2}
            transform="rotate(135 296.853 262.985)"
            fill="#00FF1E"
            stroke="black"
        />
        <rect
            x={267.154}
            y={292.684}
            width={4}
            height={8}
            rx={2}
            transform="rotate(135 267.154 292.684)"
            fill="#00FF1E"
            stroke="black"
        />
    </svg>
        );
    }
);

Table8SeaterGreen.displayName = "Table4SeaterGreen";
export default Table8SeaterGreen;
