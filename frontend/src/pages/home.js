import Sidebar from "../../components/sidebar.js"; // ou o caminho relativo correto
import { useState } from "react";

export default function HomePage() {
  const [items, setItems] = useState([
    { id: "1", title: "Projeto Alpha", type: "doc" },
    { id: "2", title: "Plugin do Zoro", type: "plugin" }
  ]);

  function handleItemClick(id, type) {
    console.log("Clicou no item:", id, "Tipo:", type);
    // aqui vai tua lógica de navegação ou seleção
  }

  function handleDelete(id, type) {
    console.log("Remover item:", id);
    setItems(items.filter(item => item.id !== id));
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        allItems={items}
        handleItemClick={handleItemClick}
        handleDelete={handleDelete}
      />

      <main style={{ flexGrow: 1, padding: "2rem" }}>
        <h2>Área Principal</h2>
        <p>Conteúdo da sua página vai aqui 🧠</p>
      </main>
    </div>
  );
}
