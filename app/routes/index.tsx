import { Link } from "@remix-run/react";

export default function Index() {
  const dataInput = [
    {
      id: 'school', title: "Data Sekolah"
    },
    {
      id: 'supplier', title: "Data Penyedia"
    },
    {
      id: 'transaction', title: "Data Transaksi"
    },
    {
      id: 'tax', title: "Pajak Belanja"
    },
  ];

  const dataReport = [
    {
      id: 'print', title: "Cetak SPJ"
    },
    {
      id: 'docs', title: "Buat Rekap"
    },
  ]

  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative sm:overflow-hidden sm:rounded-2xl">
            <div className="relative px-4 pt-16 pb-8 sm:px-6 sm:pt-24 sm:pb-14 lg:px-8 lg:pb-20 lg:pt-32">
              <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
                <span className="block uppercase text-yellow-500 drop-shadow-md">
                  WEB UDIN
                </span>
              </h1>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl py-2 px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-extrabold tracking-tight sm:text-2xl lg:text-2xl">
            <span className="block drop-shadow-md">
              Input Data
            </span>
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-8">
            {dataInput.map((el) => (
              <Link
                key={el.id}
                to={el.id}
                className="flex items-center justify-center rounded-md bg-indigo-500 px-4 py-3 font-medium text-white hover:bg-yellow-600"
              >
                {el.title}
              </Link>
            ))}
          </div>
          <div className="mt-16"></div>
          <h2 className="text-center text-2xl font-extrabold tracking-tight sm:text-2xl lg:text-2xl">
            <span className="block drop-shadow-md">
              Buat Laporan
            </span>
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-8">
            {dataReport.map((el) => (
              <Link
                key={el.id}
                to={el.id}
                className="flex items-center justify-center rounded-md bg-indigo-500 px-4 py-3 font-medium text-white hover:bg-yellow-600"
              >
                {el.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
