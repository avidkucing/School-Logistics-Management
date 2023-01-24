import { Link } from "@remix-run/react";

export default function NoteIndexPage() {
  return (
    <p>
      Belum ada transaksi terpilih. Pilih transaksi di samping, atau{" "}
      <Link to="new" className="text-blue-500 underline">
        tambah transaksi baru.
      </Link>
    </p>
  );
}
