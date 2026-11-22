import type { ReactNode } from "react";
import css from "./LayoutNotes.module.css";

interface NotesFilterLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

const NotesFilterLayout = ({ children, sidebar }: NotesFilterLayoutProps) => {
  return (
    <section className={css.container}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <div className={css.notesWrapper}>{children}</div>
    </section>
  );
};

export default NotesFilterLayout;
