"use client";
import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number;          // defaults to 64 px
}

/* ---------- helpers ---------- */
const STROKE_WIDTH = 2;

const Chair = ({
                   cx,
                   cy,
                   size = 8,
               }: {
    cx: number;
    cy: number;
    size?: number;
}) => (
    <rect
        x={cx - size / 2}
        y={cy - size / 2}
        width={size}
        height={size}
        rx={1}
        stroke="currentColor"
        strokeWidth={1.5}
        fill="none"
    />
);

/* ---------- ROUND TABLES ---------- */

export const TableIconRound4: React.FC<IconProps> = ({ size = 64, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" {...props}>
        <circle
            cx={32}
            cy={32}
            r={14}
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
            fill="none"
        />
        <Chair cx={32} cy={8} />
        <Chair cx={56} cy={32} />
        <Chair cx={32} cy={56} />
        <Chair cx={8} cy={32} />
    </svg>
);

export const TableIconRound6: React.FC<IconProps> = ({ size = 64, ...props }) => {
    const chairs: [number, number][] = [
        [32, 8],
        [53, 20],
        [53, 44],
        [32, 56],
        [11, 44],
        [11, 20],
    ];
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" {...props}>
            <circle
                cx={32}
                cy={32}
                r={14}
                stroke="currentColor"
                strokeWidth={STROKE_WIDTH}
                fill="none"
            />
            {chairs.map(([cx, cy], i) => (
                <Chair key={i} cx={cx} cy={cy} />
            ))}
        </svg>
    );
};

export const TableIconRound8: React.FC<IconProps> = ({ size = 64, ...props }) => {
    const chairs: [number, number][] = [
        [32, 8],
        [49, 15],
        [56, 32],
        [49, 49],
        [32, 56],
        [15, 49],
        [8, 32],
        [15, 15],
    ];
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" {...props}>
            <circle
                cx={32}
                cy={32}
                r={14}
                stroke="currentColor"
                strokeWidth={STROKE_WIDTH}
                fill="none"
            />
            {chairs.map(([cx, cy], i) => (
                <Chair key={i} cx={cx} cy={cy} />
            ))}
        </svg>
    );
};

/* ---------- SQUARE & RECTANGULAR ---------- */

export const TableIconSquare4: React.FC<IconProps> = ({ size = 64, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" {...props}>
        <rect
            x={22}
            y={22}
            width={20}
            height={20}
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
            fill="none"
        />
        <Chair cx={32} cy={6} />
        <Chair cx={58} cy={32} />
        <Chair cx={32} cy={58} />
        <Chair cx={6} cy={32} />
    </svg>
);

export const TableIconRectangle6: React.FC<IconProps> = ({ size = 64, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" {...props}>
        <rect
            x={14}
            y={24}
            width={36}
            height={16}
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
            fill="none"
        />
        {/* ends */}
        <Chair cx={32} cy={6} />
        <Chair cx={32} cy={58} />
        {/* long-sides */}
        <Chair cx={6} cy={28} />
        <Chair cx={6} cy={36} />
        <Chair cx={58} cy={28} />
        <Chair cx={58} cy={36} />
    </svg>
);

/* ---------- OVAL ---------- */

export const TableIconOval8: React.FC<IconProps> = ({ size = 64, ...props }) => {
    const chairs: [number, number][] = [
        [32, 6],
        [48, 10],
        [58, 22],
        [58, 42],
        [48, 54],
        [32, 58],
        [16, 54],
        [6, 42],
    ];
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" {...props}>
            <ellipse
                cx={32}
                cy={32}
                rx={20}
                ry={12}
                stroke="currentColor"
                strokeWidth={STROKE_WIDTH}
                fill="none"
            />
            {chairs.map(([cx, cy], i) => (
                <Chair key={i} cx={cx} cy={cy} />
            ))}
        </svg>
    );
};

/* ---------- convenient named export ---------- */
export const TableIcons = {
    TableIconRound4,
    TableIconRound6,
    TableIconRound8,
    TableIconSquare4,
    TableIconRectangle6,
    TableIconOval8,
};
