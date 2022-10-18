import { Link } from "@remix-run/react";

export default function NoteIndexPage() {
  return (
    <p>
      Belum ada penyedia terpilih. Pilih penyedia di samping, atau{" "}
      <Link to="new" className="text-blue-500 underline">
        tambah penyedia baru.
      </Link>
    </p>
  );
}
