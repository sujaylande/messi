import { useEffect, useState } from "react";
import axios from "axios";
import { MenuForm } from "../components/MenuForm";
import { MenuBoard } from "../components/MenuBoard";

function Menu() {
    const [menu, setMenu] = useState([]);

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        const res = await axios.get("http://localhost:5000/api/manager/display-menu");
        setMenu(res.data);
    };

    return (
        <>
            <MenuForm fetchMenu={fetchMenu} />
            <MenuBoard menu={menu} />
        </>
    );
}

export default Menu;
