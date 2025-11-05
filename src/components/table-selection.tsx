"use client";

import * as React from "react";
import type { RestaurantLayout, Table } from "@/lib/types";

// SVG icon components (each accepts { taken?: boolean } and SVG props)
import Table2SeaterGreen from "@/components/table-icons/Table2SeaterGreen";
import Table4SeaterGreen from "@/components/table-icons/Table4SeaterGreen";
import Table6SeaterGreen from "@/components/table-icons/Table6SeaterGreen";

type TableSelectionProps = {
    layout: RestaurantLayout;
    selectedGuests: number;
    selectedTableId?: string;
    onTableSelect: (tableId: string) => void;
};

const canAccommodateGuests = (table: Table, guests: number) =>
    table.status === "available" && table.seats >= guests;

const takenFlag = (table: Table, guests: number) =>
    table.status !== "available" || table.seats < guests;

function iconFor(table: Table) {
    switch (table.seats) {
        case 2:
            return Table2SeaterGreen;
        case 4:
            return Table4SeaterGreen;
        case 6:
            return Table6SeaterGreen;
        default:
            return null;
    }
}

function TableSelection({
                            layout,
                            selectedGuests,
                            selectedTableId,
                            onTableSelect,
                        }: TableSelectionProps) {
    const [hovered, setHovered] = React.useState<string | null>(null);

    const handleClick = (table: Table) => {
        if (canAccommodateGuests(table, selectedGuests)) onTableSelect(table.id);
    };

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                aspectRatio: `${layout.width} / ${layout.height}`,
                background: "white",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.08)",
                overflow: "hidden",
            }}
        >
            {layout.tables.map((table) => {
                const Icon = iconFor(table);
                if (!Icon) return null; // drop other table types

                const canPick = canAccommodateGuests(table, selectedGuests);
                const isSelected = selectedTableId === table.id;

                const leftPct = (table.x / layout.width) * 100;
                const topPct = (table.y / layout.height) * 100;
                const widthPct = (table.width / layout.width) * 100;
                const heightPct = (table.height / layout.height) * 100;

                return (
                    <div
                        key={table.id}
                        style={{
                            position: "absolute",
                            left: `${leftPct}%`,
                            top: `${topPct}%`,
                            width: `${widthPct}%`,
                            height: `${heightPct}%`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: canPick ? "pointer" : "not-allowed",
                            outline: isSelected
                                ? "3px solid #3b82f6"
                                : hovered === table.id && canPick
                                    ? "2px dashed rgba(59,130,246,0.6)"
                                    : "none",
                            borderRadius: 12,
                            transition: "transform 120ms ease, outline-color 120ms ease, opacity 120ms ease",
                            transform:
                                hovered === table.id && canPick && !isSelected
                                    ? "scale(1.03)"
                                    : "scale(1)",
                            opacity: !canPick && !isSelected ? 0.75 : 1,
                        }}
                        onMouseEnter={() => setHovered(table.id)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => handleClick(table)}
                        title={`Table ${table.number} • ${table.seats} seats • ${table.status}`}
                    >
                        <Icon
                            width="100%"
                            height="100%"
                            taken={takenFlag(table, selectedGuests)}
                            aria-label={`Table ${table.number}`}
                        />
                    </div>
                );
            })}
        </div>
    );
}

export default TableSelection;
export { TableSelection };
