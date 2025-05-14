export default function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-3 w-100 mt-auto">
      <div className="container">
        © {new Date().getFullYear()} KerKomKuy Project
      </div>
    </footer>
  );
}
