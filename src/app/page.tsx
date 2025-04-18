import styles from "./page.module.scss";
import ClintPage from "@/Components/client-page";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";

import "../../i18n";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <div className={styles.container}>
      <ClintPage session={session} />
    </div>
  );
}
