import Sidebar from "../../components/sidebar.js";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import ResponseMessage from "../../components/responseMessage.js";

export default function HomePage() {
  const [items, setItems] = useState([

  ]);

  function handleItemClick(id, type) {
    console.log("Clicou no item:", id, "Tipo:", type);
  }

  function handleDelete(id, type) {
    console.log("Remover item:", id);
    setItems(items.filter(item => item.id !== id));
  }

  const [res, setres] = useState({ user: {}, message: '', status: '' });
  const [welcomeText, setWelcomeText] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get('token') || '';

      const res = await fetch('https://noteke-api-bfct.onrender.com/Person', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_KEYACCESS,
          'authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`Erro na API: ${res.status} ${res.statusText}`);
      }

      const json = await res.json();
      setres(json || {});
      const WelcomeText = [
        `Hello ${json.user?.Name}`,
        `Hiii ${json.user?.Name}`,
        `All good?`,
        `Welcome`,
        `You are the best!`
      ];
      const index = Math.floor(Math.random() * WelcomeText.length);
      setWelcomeText(WelcomeText[index]);
    };

    fetchUser();
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        allItems={items}
        handleItemClick={handleItemClick}
        handleDelete={handleDelete}
        message={res}
      />

      <main style={{ flexGrow: 1, padding: "2rem" }}>
        <div className="Header-home">
          <h1>{welcomeText}</h1>
        </div>
      </main>
    </div>
  );
}
