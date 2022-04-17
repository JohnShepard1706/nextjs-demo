import Layout from "../components/layout/Layout";
import "../styles/globals.css";

// Component stores the page content to be rendered
// PageProps stores any props that our page might be getting
// If we wrap the "Component" component with any other component (read that again xD), the page we're currently on gets wrapped inside that component. Like here we need every component wrapped with the Layout component. So it proves useful here.

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
