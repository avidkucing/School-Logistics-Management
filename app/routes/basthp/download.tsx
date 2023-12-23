export default function NewNotePage() {
  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="mx-auto max-w-7xl py-2 px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-extrabold tracking-tight sm:text-2xl lg:text-2xl">
            <span className="block drop-shadow-md">
              Dokumen berhasil dibuat.
            </span>
          </h2>
          <a
            className="mt-8 flex items-center justify-center rounded-md bg-indigo-500 px-4 py-3 font-medium text-white hover:bg-yellow-600"
            href="/basthp.docx" download="basthp.docx">Download Dokumen</a>
        </div>
      </div>
    </main>
  );
}
