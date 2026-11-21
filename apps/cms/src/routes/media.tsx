import * as React from "react";
import { Card, Badge, Alert, Table, Skeleton, Button } from "@portfolio-cms/ui";

export interface MediaRow {
  id: string;
  title: string;
  updatedAt: string;
  status: "draft" | "review" | "published";
}

export interface MediaProps {
  rows: MediaRow[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onOpen?: (id: string) => void;
}

const statusLabel: Record<MediaRow["status"], string> = {
  draft: "Draft",
  review: "In review",
  published: "Published",
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function MediaRoute({ rows, loading = false, error = null, onRetry, onOpen }: MediaProps) {
  if (loading) {
    return (
      <Card>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Card>
    );
  }
  if (error) {
    return (
      <Alert variant="destructive" role="alert">
        <p>{error}</p>
        {onRetry ? <Button onClick={onRetry as never}>Retry</Button> : null}
      </Alert>
    );
  }
  if (rows.length === 0) {
    return (
      <Card>
        <p>Nothing here yet.</p>
      </Card>
    );
  }
  return (
    <Card>
      <h1>Media</h1>
      <Table>
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Status</th>
            <th scope="col">Updated</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} onClick={() => onOpen?.(row.id)}>
              <td>{row.title}</td>
              <td>
                <Badge variant={row.status === "published" ? "default" : "muted"}>{statusLabel[row.status]}</Badge>
              </td>
              <td>{formatDate(row.updatedAt)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}
