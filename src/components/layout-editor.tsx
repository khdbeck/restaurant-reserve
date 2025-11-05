"use client";

import { useState, useCallback, useRef, cloneElement } from "react";
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  TableIconRound4,
  TableIconRound6,
  TableIconRound8,
  TableIconSquare4,
  TableIconRectangle6,
  TableIconOval8,
} from "../components/ui/tables";
import type {
  RestaurantLayout,
  Table,
  Obstacle,
  LayoutEditor as LayoutEditorState, LayoutAction,
} from "@/lib/types";
import {
  Plus,
  Trash2,
  Copy,
  Save,
  Undo,
  Redo,
  Move,
  Settings,
  Eye,
  Users,
  Crown,
  Square,
  Circle,
  Minus,
  DoorOpen,
  ChefHat,
  Wine,
  Bath,
  Music,
  Grid,
} from "lucide-react";

/* --------------------------------------------------
 * Mapping helpers
 * -------------------------------------------------- */
const TABLE_TYPES = [
  { value: "round", label: "Round", icon: TableIconRound6 },
  { value: "square", label: "Square", icon: TableIconSquare4 },
  { value: "rectangle", label: "Rectangle", icon: TableIconRectangle6 },
] as const;

const OBSTACLE_TYPES = [
  { value: "entrance", label: "Entrance", icon: DoorOpen, color: "bg-blue-200 border-blue-400" },
  { value: "kitchen", label: "Kitchen", icon: ChefHat, color: "bg-orange-200 border-orange-400" },
  { value: "bar", label: "Bar", icon: Wine, color: "bg-purple-200 border-purple-400" },
  { value: "restroom", label: "Restroom", icon: Bath, color: "bg-gray-200 border-gray-400" },
  { value: "stage", label: "Stage", icon: Music, color: "bg-pink-200 border-pink-400" },
  { value: "wall", label: "Wall", icon: Grid, color: "bg-stone-200 border-stone-400" },
] as const;

/**
 * Returns the proper SVG icon for a given table type and seat count.
 * `size` lets us scale the icon to fit the table bounding-box; defaults to 64 px.
 */
export const getTableShapeIcon = (
    type: string,
    seats: number,
    size = 64
) => {
  if (type === "round") {
    if (seats >= 8) return <TableIconRound8 size={size} />;
    if (seats >= 6) return <TableIconRound6 size={size} />;
    return <TableIconRound4 size={size} />;
  }
  if (type === "rectangle") return <TableIconRectangle6 size={size} />;
  if (type === "square") return <TableIconSquare4 size={size} />;
  return <TableIconRound4 size={size} />;
};

const DEFAULT_TABLE_SIZE = { width: 80, height: 80 };
const DEFAULT_OBSTACLE_SIZE = { width: 100, height: 60 };
const GRID_SIZE = 20;

/* --------------------------------------------------
 * LayoutEditor component
 * -------------------------------------------------- */
export interface LayoutEditorProps {
  layout: RestaurantLayout;
  onSaveAction: (layout: RestaurantLayout) => void;
  mode?: "edit" | "view";
  isOwner?: boolean;
}

export function LayoutEditor({
                               layout: initialLayout,
                               onSaveAction,
                               mode = "edit",
                               isOwner = true,
                             }: LayoutEditorProps) {
  /* ---------- state ---------- */
  const [layout, setLayout] = useState<RestaurantLayout>(initialLayout);
  const [editorState, setEditorState] = useState<LayoutEditorState>({
    mode: "view",
    history: [],
    historyIndex: -1,
  });
  const [draggedItem, setDraggedItem] = useState<Table | Obstacle | null>(null);
  const [selectedTool, setSelectedTool] =
      useState<"select" | "table" | "obstacle">("select");
  const [newTableForm, setNewTableForm] = useState<{
    type: "round" | "square" | "rectangle";
    seats: number;
    features: string[];
  }>({
    type: "round",
    seats: 4,
    features: [],
  });
  const [newObstacleForm, setNewObstacleForm] = useState<{
    type: "entrance" | "kitchen" | "bar" | "restroom" | "stage" | "wall";
    label: string;
  }>({
    type: "wall",
    label: "",
  });

  const snapToGrid = useCallback(
      (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE,
      []
  );
  const generateId = useCallback(
      () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      []
  );

  const addToHistory = useCallback((action: string, item: Table | Obstacle) => {
    setEditorState((prev) => ({
      ...prev,
      history: [
        ...prev.history.slice(0, prev.historyIndex + 1),
        { action, item } as unknown as LayoutAction
      ],

      historyIndex: prev.historyIndex + 1,
    }));
  }, []);

  /* ---------- canvas interactions ---------- */
  const handleCanvasClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (!isOwner || selectedTool === "select") return;

        const rect = event.currentTarget.getBoundingClientRect();
        const x = snapToGrid(event.clientX - rect.left);
        const y = snapToGrid(event.clientY - rect.top);

        if (selectedTool === "table") {
          const newTable: Table = {
            id: generateId(),
            number: (layout.tables.length + 1).toString(),
            x,
            y,
            ...DEFAULT_TABLE_SIZE,
            seats: newTableForm.seats,
            type: newTableForm.type,
            status: "available",
            features: newTableForm.features,
            lastUpdated: new Date(),
          };

          setLayout((prev) => ({
            ...prev,
            tables: [...prev.tables, newTable],
          }));
          addToHistory("add_table", newTable);
        } else if (selectedTool === "obstacle") {
          const newObstacle: Obstacle = {
            id: generateId(),
            type: newObstacleForm.type,
            label: newObstacleForm.label || newObstacleForm.type,
            x,
            y,
            ...DEFAULT_OBSTACLE_SIZE,
          };

          setLayout((prev) => ({
            ...prev,
            obstacles: [...prev.obstacles, newObstacle],
          }));
          addToHistory("add_obstacle", newObstacle);
        }
      },
      [
        isOwner,
        selectedTool,
        layout.tables.length,
        newTableForm,
        newObstacleForm,
        addToHistory,
        generateId,
        snapToGrid,
      ]
  );

  const handleDragEnd = useCallback(
      (event: DragEndEvent) => {
        const { active, delta } = event;
        if (!active || !delta) return;

        const [type, id] = active.id.toString().split("_");
        const newX = snapToGrid(delta.x);
        const newY = snapToGrid(delta.y);

        if (type === "table") {
          setLayout((prev) => ({
            ...prev,
            tables: prev.tables.map((table) =>
                table.id === id
                    ? { ...table, x: table.x + newX, y: table.y + newY, lastUpdated: new Date() }
                    : table
            ),
          }));
        } else if (type === "obstacle") {
          setLayout((prev) => ({
            ...prev,
            obstacles: prev.obstacles.map((obstacle) =>
                obstacle.id === id ? { ...obstacle, x: obstacle.x + newX, y: obstacle.y + newY } : obstacle
            ),
          }));
        }

        setDraggedItem(null);
      },
      [snapToGrid]
  );

  const handleDragStart = useCallback(
      (event: DragStartEvent) => {
        const { active } = event;
        const [type, id] = active.id.toString().split("_");

        if (type === "table") {
          const table = layout.tables.find((t) => t.id === id);
          if (table) setDraggedItem(table);
        } else if (type === "obstacle") {
          const obstacle = layout.obstacles.find((o) => o.id === id);
          if (obstacle) setDraggedItem(obstacle);
        }
      },
      [layout]
  );

  const deleteItem = useCallback((type: "table" | "obstacle", id: string) => {
    if (type === "table") {
      setLayout((prev) => ({
        ...prev,
        tables: prev.tables.filter((table) => table.id !== id),
      }));
    } else {
      setLayout((prev) => ({
        ...prev,
        obstacles: prev.obstacles.filter((obstacle) => obstacle.id !== id),
      }));
    }
  }, []);

  const handleSave = useCallback(() => {
    onSaveAction({
      ...layout,
      updatedAt: new Date(),
    });
  }, [layout, onSaveAction]);

  /* ---------- helper icons ---------- */
  const getTableIcon = (table: Table) => {
    if (table.features?.includes("premium") || table.features?.includes("private")) {
      return <Crown className="h-3 w-3" />;
    }
    if (table.features?.includes("window view")) {
      return <Eye className="h-3 w-3" />;
    }
    return <Users className="h-3 w-3" />;
  };

  /* --------------------------------------------------
   * Table & obstacle renderers
   * -------------------------------------------------- */
  const TableComponent = ({ table }: { table: Table }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id: `table_${table.id}`,
      disabled: !isOwner || selectedTool !== "select",
    });

    const style = transform
        ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
        : undefined;

    const iconSize = Math.min(table.width, table.height) - 4;

    return (
        <div
            ref={setNodeRef}
            style={{
              position: "absolute",
              left: table.x,
              top: table.y,
              width: table.width,
              height: table.height,
              ...style,
            }}
            className={cn(
                "relative group flex items-center justify-center text-green-600 transition-all",
                isDragging && "opacity-50",
                selectedTool === "select" && isOwner && "cursor-move hover:scale-105"
            )}
            {...attributes}
            {...listeners}
        >
          {/* SVG table shape */}
          {getTableShapeIcon(table.type, table.seats, iconSize)}

          {/* overlayed label */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-xs font-medium">
            <div className="flex items-center gap-1">
              {getTableIcon(table)}
              <span>{table.number}</span>
            </div>
            <span className="text-[10px]">{table.seats} seats</span>
          </div>

          {/* delete button */}
          {isOwner && selectedTool === "select" && (
              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    size="sm"
                    variant="destructive"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem("table", table.id);
                    }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
          )}
        </div>
    );
  };

  const ObstacleComponent = ({ obstacle }: { obstacle: Obstacle }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id: `obstacle_${obstacle.id}`,
      disabled: !isOwner || selectedTool !== "select",
    });

    const style = transform
        ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
        : undefined;

    const obstacleType = OBSTACLE_TYPES.find((type) => type.value === obstacle.type);
    const Icon = obstacleType?.icon || Grid;

    return (
        <div
            ref={setNodeRef}
            style={{
              position: "absolute",
              left: obstacle.x,
              top: obstacle.y,
              width: obstacle.width,
              height: obstacle.height,
              ...style,
            }}
            className={cn(
                "relative flex items-center justify-center text-xs font-medium border-2 rounded transition-all group",
                obstacleType?.color || "bg-gray-200 border-gray-400",
                isDragging && "opacity-50",
                selectedTool === "select" && isOwner && "cursor-move hover:scale-105"
            )}
            {...attributes}
            {...listeners}
        >
          <div className="flex flex-col items-center gap-1">
            <Icon className="h-4 w-4" />
            {obstacle.label && <span className="text-[10px] truncate max-w-[80%]">{obstacle.label}</span>}
          </div>
          {isOwner && selectedTool === "select" && (
              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    size="sm"
                    variant="destructive"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem("obstacle", obstacle.id);
                    }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
          )}
        </div>
    );
  };

  /* -------------------------------------------------- */
  const { setNodeRef: setCanvasRef } = useDroppable({ id: "canvas" });

  return (
      <div className="flex flex-col h-full">
        {/* Toolbar */}
        {isOwner && (
            <Card className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span>Layout Editor</span>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="bg-tablein-blue">
                      <Save className="h-4 w-4 mr-2" />
                      Save Layout
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tool Selection */}
                <div className="flex gap-2">
                  <Button
                      variant={selectedTool === "select" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTool("select")}
                  >
                    <Move className="h-4 w-4 mr-2" />
                    Select
                  </Button>
                  <Button
                      variant={selectedTool === "table" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTool("table")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Add Table
                  </Button>
                  <Button
                      variant={selectedTool === "obstacle" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTool("obstacle")}
                  >
                    <Grid className="h-4 w-4 mr-2" />
                    Add Obstacle
                  </Button>
                </div>

                <Separator />

                {/* Table Configuration */}
                {selectedTool === "table" && (
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <Label>Type</Label>
                        <Select
                            value={newTableForm.type}
                            onValueChange={(value: "round" | "square" | "rectangle") =>
                                setNewTableForm((prev) => ({ ...prev, type: value }))
                            }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TABLE_TYPES.map((type) => {
                              const Icon = type.icon;
                              return (
                                  <SelectItem key={type.value} value={type.value}>
                                    <div className="flex items-center gap-2">
                                      <Icon className="h-4 w-4" />
                                      {type.label}
                                    </div>
                                  </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Seats</Label>
                        <Input
                            type="number"
                            min="1"
                            max="20"
                            value={newTableForm.seats}
                            onChange={(e) =>
                                setNewTableForm((prev) => ({ ...prev, seats: Number.parseInt(e.target.value) }))
                            }
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Features</Label>
                        <div className="flex gap-2 flex-wrap mt-1">
                          {["window view", "premium", "private", "bar seating"].map((feature) => (
                              <Badge
                                  key={feature}
                                  variant={newTableForm.features.includes(feature) ? "default" : "outline"}
                                  className="cursor-pointer"
                                  onClick={() => {
                                    setNewTableForm((prev) => ({
                                      ...prev,
                                      features: prev.features.includes(feature)
                                          ? prev.features.filter((f) => f !== feature)
                                          : [...prev.features, feature],
                                    }));
                                  }}
                              >
                                {feature}
                              </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                )}

                {/* Obstacle Configuration */}
                {selectedTool === "obstacle" && (
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Type</Label>
                        <Select
                            value={newObstacleForm.type}
                            onValueChange={(value: "entrance" | "kitchen" | "bar" | "restroom" | "stage" | "wall") =>
                                setNewObstacleForm((prev) => ({ ...prev, type: value }))
                            }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {OBSTACLE_TYPES.map((type) => {
                              const Icon = type.icon;
                              return (
                                  <SelectItem key={type.value} value={type.value}>
                                    <div className="flex items-center gap-2">
                                      <Icon className="h-4 w-4" />
                                      {type.label}
                                    </div>
                                  </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Label>Label</Label>
                        <Input
                            placeholder="Enter label..."
                            value={newObstacleForm.label}
                            onChange={(e) =>
                                setNewObstacleForm((prev) => ({ ...prev, label: e.target.value }))
                            }
                        />
                      </div>
                    </div>
                )}
              </CardContent>
            </Card>
        )}

        {/* Canvas */}
        <Card className="flex-1">
          <CardContent className="p-4 h-full">
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <div
                  ref={setCanvasRef}
                  className="relative w-full h-full border-2 border-dashed border-muted-foreground/20 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900"
                  style={{
                    minHeight: layout.height || 600,
                    backgroundImage: "radial-gradient(circle, #0003 1px, transparent 1px)",
                    backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
                  }}
                  onClick={handleCanvasClick}
              >
                {/* Tables */}
                {layout.tables.map((table) => (
                    <TableComponent key={table.id} table={table} />
                ))}

                {/* Obstacles */}
                {layout.obstacles.map((obstacle) => (
                    <ObstacleComponent key={obstacle.id} obstacle={obstacle} />
                ))}
              </div>

              <DragOverlay>
                {draggedItem && "number" in draggedItem ? (
                    <TableComponent table={draggedItem} />
                ) : draggedItem ? (
                    <ObstacleComponent obstacle={draggedItem} />
                ) : null}
              </DragOverlay>
            </DndContext>
          </CardContent>
        </Card>

        {/* Layout Info */}
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Tables: </span>
                <span>{layout.tables.length}</span>
              </div>
              <div>
                <span className="font-medium">Total Seats: </span>
                <span>{layout.tables.reduce((sum, table) => sum + table.seats, 0)}</span>
              </div>
              <div>
                <span className="font-medium">Obstacles: </span>
                <span>{layout.obstacles.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
