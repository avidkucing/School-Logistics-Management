import { Link } from "@remix-run/react";

export default function NoteIndexPage() {
  return (
    <p>
      Belum ada sekolah terpilih. Pilih sekolah di samping, atau{" "}
      <Link to="new" className="text-blue-500 underline">
        tambah sekolah baru.
      </Link>
    </p>
  );
}
