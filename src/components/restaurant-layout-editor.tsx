"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { RestaurantLayout, Table } from "@/lib/types";

import Table2SeaterGreen from "@/components/table-icons/Table2SeaterGreen";
import Table4SeaterGreen from "@/components/table-icons/Table4SeaterGreen";
import Table6SeaterGreen from "@/components/table-icons/Table6SeaterGreen";
import Table8SeaterGreen from "@/components/table-icons/Table8SeaterGreen";
import ToiletIcon from "@/components/table-icons/ToiletIcon";
import StageIcon from "@/components/table-icons/StageIcon";
import WallIcon from "@/components/table-icons/WallIcon";

type ItemCategory = "table" | "toilet" | "stage" | "wall";

function iconFor(category: ItemCategory, seats?: number) {
    if (category === "toilet") return ToiletIcon;
    if (category === "stage") return StageIcon;
    if (category === "wall") return WallIcon;
    switch (seats) {
        case 2:
            return Table2SeaterGreen;
        case 4:
            return Table4SeaterGreen;
        case 6:
            return Table6SeaterGreen;
        case 8:
            return Table8SeaterGreen;
        default:
            return Table4SeaterGreen;
    }
}

type Props = {
    initialLayout?: RestaurantLayout;
    onLayoutChange?: (layout: RestaurantLayout) => void;
};

export function RestaurantLayoutEditor({
                                           initialLayout = {
                                               id: "layout-new",
                                               name: "New Layout",
                                               width: 800,
                                               height: 600,
                                               tables: [],
                                               obstacles: [],
                                           },
                                           onLayoutChange,
                                       }: Props) {
    const [layout, setLayout] = React.useState<RestaurantLayout>(initialLayout);
    const [selectedItemId, setSelectedItemId] = React.useState<string | null>(null);
    const [newSeats, setNewSeats] = React.useState(4);
    const [category, setCategory] = React.useState<ItemCategory>("table");
    const [jsonValue, setJsonValue] = React.useState(JSON.stringify(initialLayout.tables, null, 2));

    React.useEffect(() => {
        setJsonValue(JSON.stringify(layout.tables, null, 2));
    }, [layout]);

    const updateLayout = (updated: RestaurantLayout) => {
        setLayout(updated);
        onLayoutChange?.(updated);
    };

    const addItem = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (target.closest(".layout-icon")) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * layout.width;
        const y = ((e.clientY - rect.top) / rect.height) * layout.height;

        const newItem: Table = {
            id: `item-${layout.tables.length + 1}`,
            number: `${layout.tables.length + 1}`,
            x,
            y,
            width:
                category === "stage"
                    ? 160
                    : category === "toilet"
                        ? 40
                        : category === "wall"
                            ? 200
                            : 80,
            height:
                category === "stage"
                    ? 80
                    : category === "toilet"
                        ? 40
                        : category === "wall"
                            ? 10
                            : 80,
            seats: category === "table" ? newSeats : 0,
            type: "round",
            category,
            status: "available",
            rotation: 0,
        };

        const updated = { ...layout, tables: [...layout.tables, newItem] };
        updateLayout(updated);
    };

    const removeSelected = () => {
        if (!selectedItemId) return;
        const updated = {
            ...layout,
            tables: layout.tables.filter((t) => t.id !== selectedItemId),
        };
        setSelectedItemId(null);
        updateLayout(updated);
    };

    const rotateSelected = () => {
        if (!selectedItemId) return;
        const updatedTables = layout.tables.map((t) =>
            t.id === selectedItemId ? { ...t, rotation: ((t.rotation ?? 0) + 90) % 360 } : t
        );
        updateLayout({ ...layout, tables: updatedTables });
    };

    const handleDrag = (e: React.MouseEvent, itemId: string) => {
        e.stopPropagation();
        setSelectedItemId(itemId);
        const startX = e.clientX;
        const startY = e.clientY;
        const item = layout.tables.find((t) => t.id === itemId);
        if (!item) return;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const dx = ((moveEvent.clientX - startX) / 800) * layout.width;
            const dy = ((moveEvent.clientY - startY) / 600) * layout.height;
            const newX = Math.min(Math.max(0, item.x + dx), layout.width - item.width);
            const newY = Math.min(Math.max(0, item.y + dy), layout.height - item.height);
            const updatedTables = layout.tables.map((t) =>
                t.id === itemId ? { ...t, x: newX, y: newY } : t
            );
            updateLayout({ ...layout, tables: updatedTables });
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    const handleResize = (e: React.MouseEvent, itemId: string) => {
        e.stopPropagation();
        const startX = e.clientX;
        const startY = e.clientY;
        const item = layout.tables.find((t) => t.id === itemId);
        if (!item) return;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const dx = ((moveEvent.clientX - startX) / 800) * layout.width;
            const dy = ((moveEvent.clientY - startY) / 600) * layout.height;
            const newWidth = Math.max(30, Math.min(layout.width - item.x, item.width + dx));
            const newHeight = Math.max(30, Math.min(layout.height - item.y, item.height + dy));
            const updatedTables = layout.tables.map((t) =>
                t.id === itemId
                    ? { ...t, width: Math.round(newWidth), height: Math.round(newHeight) }
                    : t
            );
            updateLayout({ ...layout, tables: updatedTables });
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setJsonValue(value);
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
                const updated = { ...layout, tables: parsed as Table[] };
                updateLayout(updated);
            }
        } catch {}
    };

    const selectedItem = layout.tables.find((t) => t.id === selectedItemId);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
                <Select onValueChange={(val: ItemCategory) => setCategory(val)} defaultValue="table">
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Item Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="table">Table</SelectItem>
                        <SelectItem value="toilet">Toilet</SelectItem>
                        <SelectItem value="stage">Stage</SelectItem>
                        <SelectItem value="wall">Wall</SelectItem>
                    </SelectContent>
                </Select>

                {category === "table" && (
                    <Select
                        onValueChange={(val: "2" | "4" | "6" | "8") => setNewSeats(Number(val))}
                        defaultValue={String(newSeats)}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Seats" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2">2 Seats</SelectItem>
                            <SelectItem value="4">4 Seats</SelectItem>
                            <SelectItem value="6">6 Seats</SelectItem>
                            <SelectItem value="8">8 Seats</SelectItem>
                        </SelectContent>
                    </Select>
                )}

                {selectedItemId && (
                    <>
                        <Button type="button" variant="secondary" onClick={rotateSelected}>
                            Rotate 90°
                        </Button>
                        <Button type="button" variant="destructive" onClick={removeSelected}>
                            Remove Selected
                        </Button>
                    </>
                )}
            </div>

            <div
                onClick={addItem}
                className="relative bg-white border border-gray-300 rounded-md overflow-hidden"
                style={{ width: layout.width, height: layout.height }}
            >
                {layout.tables.map((item) => {
                    const Icon = iconFor(item.category ?? "table", item.seats);
                    const leftPct = (item.x / layout.width) * 100;
                    const topPct = (item.y / layout.height) * 100;
                    const widthPct = (item.width / layout.width) * 100;
                    const heightPct = (item.height / layout.height) * 100;
                    const isSelected = selectedItemId === item.id;

                    return (
                        <div
                            key={item.id}
                            className="layout-icon"
                            style={{
                                position: "absolute",
                                left: `${leftPct}%`,
                                top: `${topPct}%`,
                                width: `${widthPct}%`,
                                height: `${heightPct}%`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "move",
                                border: isSelected ? "2px solid #3b82f6" : "none",
                                borderRadius: 12,
                                transform: item.rotation ? `rotate(${item.rotation}deg)` : undefined,
                                transformOrigin: "center center",
                            }}
                            onMouseDown={(e) => handleDrag(e, item.id)}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItemId(item.id);
                            }}
                        >
                            <Icon width="100%" height="100%" />
                            {isSelected && (
                                <div
                                    onMouseDown={(e) => handleResize(e, item.id)}
                                    className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-se-resize rounded-sm"
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Layout JSON (editable)</label>
                <textarea
                    value={jsonValue}
                    onChange={handleJsonChange}
                    className="w-full h-64 p-2 font-mono text-xs border rounded-md bg-muted focus:outline-none focus:ring-2 focus:ring-blue-400"
                    spellCheck={false}
                />
            </div>
        </div>
    );
}
