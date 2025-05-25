export default function Footer() {
  return (
    <footer
      style={{ backgroundColor: "#1e2a33" }}
      className="text-white text-center py-3 w-100 mt-auto"
    >
      <div className="container">
        © {new Date().getFullYear()} KerKomKuy (Kerja Kelompok Yuk)
      </div>
    </footer>
  );
}
