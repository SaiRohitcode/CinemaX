import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import MovieSection from "../../components/MovieSection/MovieSection";

function Home({ location, changeLocation }) {
    return (
        <>
            <Navbar
                location={location}
                changeLocation={changeLocation}
            />
            <Hero />
            <MovieSection location={location} />
        </>
    );
}

export default Home;