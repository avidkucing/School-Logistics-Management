import { Link, useLocation } from "@remix-run/react";

export default function NoteIndexPage() {
  let params = useLocation().search;

  return (
    <p>
      Belum ada detail transaksi terpilih. Pilih detail transaksi di samping, atau{" "}
      <Link to={"new" + params} className="text-blue-500 underline">
        tambah detail transaksi baru.
      </Link>
    </p>
  );
}