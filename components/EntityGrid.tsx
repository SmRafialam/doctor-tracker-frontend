"use client";

import { useState, type ReactNode } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Button, ConfirmModal, Modal, SearchInput } from "@/components/ui";

type Entity = { id: string; name: string };

type FormRenderProps<I> = {
  formId: string;
  defaultValues?: Partial<I>;
  onSubmit: (data: I) => void;
};

type Props<T extends Entity, I> = {
  title: string;
  /** Singular noun, e.g. "Doctor". */
  noun: string;
  initialItems: T[];
  searchFields: (item: T) => string[];
  renderCard: (item: T, actions: { onEdit: () => void; onDelete: () => void }) => ReactNode;
  renderForm: (props: FormRenderProps<I>) => ReactNode;
  toInput: (item: T) => I;
};

/**
 * Shared list page: search, responsive card grid, add/edit modal, delete confirmation.
 * Data lives in local state until the API is connected.
 */
export default function EntityGrid<T extends Entity, I>({
  title,
  noun,
  initialItems,
  searchFields,
  renderCard,
  renderForm,
  toInput,
}: Props<T, I>) {
  const [items, setItems] = useState(initialItems);
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [deleting, setDeleting] = useState<T | null>(null);

  const formId = `${noun.toLowerCase()}-form`;
  const q = query.trim().toLowerCase();
  const visible = q
    ? items.filter((i) => searchFields(i).some((f) => f.toLowerCase().includes(q)))
    : items;

  function openForm(item: T | null) {
    setEditing(item);
    setFormKey((k) => k + 1); // remount the form so it resets
    setFormOpen(true);
  }

  function handleSubmit(data: I) {
    setItems((prev) =>
      editing
        ? prev.map((i) => (i.id === editing.id ? { ...i, ...data } : i))
        : [...prev, { ...data, id: crypto.randomUUID() } as unknown as T],
    );
    setFormOpen(false);
  }

  function confirmDelete() {
    if (deleting) setItems((prev) => prev.filter((i) => i.id !== deleting.id));
    setDeleting(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1>{title}</h1>
          <p className="mt-1 text-sm text-slate-600">
            {items.length} {noun.toLowerCase()}
            {items.length === 1 ? "" : "s"} total
          </p>
        </div>
        <Button onClick={() => openForm(null)}>
          <PlusIcon className="h-5 w-5" aria-hidden />
          Add {noun}
        </Button>
      </div>

      <SearchInput
        label={`Search ${title.toLowerCase()}`}
        placeholder={`Search ${title.toLowerCase()}…`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {visible.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((item) => (
            <li key={item.id}>
              {renderCard(item, {
                onEdit: () => openForm(item),
                onDelete: () => setDeleting(item),
              })}
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          No {title.toLowerCase()} match “{query}”.
        </p>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? `Edit ${noun}` : `Add ${noun}`}
        actions={
          <>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form={formId}>
              {editing ? "Save changes" : `Add ${noun}`}
            </Button>
          </>
        }
      >
        <div key={formKey}>
          {renderForm({
            formId,
            defaultValues: editing ? toInput(editing) : undefined,
            onSubmit: handleSubmit,
          })}
        </div>
      </Modal>

      <ConfirmModal
        open={deleting !== null}
        title={`Delete ${noun.toLowerCase()}?`}
        message={`${deleting?.name ?? ""} will be permanently removed. This cannot be undone.`}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
