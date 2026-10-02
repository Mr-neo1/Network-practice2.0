import { Link } from "wouter";
import { Layout } from "../components/Layout";
import { useT } from "../lib/prefs";

export default function NotFound() {
  const t = useT();
  return (
    <Layout>
      <div className="page narrow">
        <h1>{t({ en: "Page not found", hi: "Page nahi mila" })}</h1>
        <p className="lede">{t({ en: "This address doesn't match any lesson or page.", hi: "Yeh address kisi lesson ya page se match nahi karta." })}</p>
        <Link href="/" className="btn btn-primary">
          {t({ en: "Go to the course", hi: "Course par jao" })}
        </Link>
      </div>
    </Layout>
  );
}
