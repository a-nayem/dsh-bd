"use client";

type Props = {
  id: string;
  label: string;
  editMode: boolean;
  isDragging: boolean;
  isWide?: boolean;
  onDragStart: (id: string) => void;
  onDragOver: (id: string) => void;
  onDrop: () => void;
  children: React.ReactNode;
};

export default function DraggablePanel({
  id, label, editMode, isDragging, isWide, onDragStart, onDragOver, onDrop, children,
}: Props) {
  return (
    <div
      className={`drag-wrap${editMode ? " edit-mode" : ""}${isDragging ? " dragging" : ""}${isWide ? " wide" : ""}`}
      draggable={editMode}
      onDragStart={() => onDragStart(id)}
      onDragOver={(e) => { e.preventDefault(); onDragOver(id); }}
      onDrop={(e) => { e.preventDefault(); onDrop(); }}
    >
      {editMode && (
        <div className="drag-handle">
          <span>⠿</span> {label}
        </div>
      )}
      {children}
    </div>
  );
}
