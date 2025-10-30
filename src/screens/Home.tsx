import useTitle from "../hooks/title";
import Menu from "../utils/menu";
import ThemeToggle from "../utils/togleTheme";

function Home() {
    return (
        <>
            <Menu />
            <ThemeToggle />
        </>
    )
}

export default Home;