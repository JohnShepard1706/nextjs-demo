// This import is handled in a different bundle (by NextJS), since it is used by getStaticProps and is not to be exposed to the users.
import Head from "next/head";
import { MongoClient } from "mongodb";
import { Fragment } from "react";

import MeetupList from "../components/meetups/MeetupList";

const HomePage = (props) => {
  // This technique causes problem, nextJS loads the source page with empty data when react triggers the first render with an empty array, then useEffect runs and re-renders the page with data, but the source page stays without that data (causes problems for SEO)
  // const [loadedMeetups, setLoadedMeetups] = useState([]);
  // useEffect(() => {
  //   // Send an http request and set the fetched data
  //   setLoadedMeetups(DUMMY_MEETUPS);
  // }, [setLoadedMeetups]);

  return (
    <Fragment>
      {/* This head is to provide desc and also name (on every page) that is visible when searching for it in the search engine */}
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active react meetups!"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
};

// This function runs not in the build, but always on the server side, updates whenever a request is made.
// Use it when your data changes every second (when even revalidate won't help) or you need access to the concrete res and req object. Otherwise getStaticProps is faster and better.
// export const getServerSideProps = async (context) => {
//   // request data, idk
//   const req = context.req;
//   // response data, idk
//   const res = context.res;

//   // fetch data from API
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
//   // No need to revalidate because it already updates whenever a request is made
// };

///////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
// To populate the source code file, static generation (SSG)
// This function gets called before the component, so that the component can be passed with the required data rather than the component loading it itself and getting nextJS to load a source page with missing data.

export const getStaticProps = async () => {
  // Code here will be executed in the build process, and will never be exposed to the user machines, so you safely and easily fetch data from a database here as well.
  const client = await MongoClient.connect(
    "mongodb+srv://john-shepard:john1706@cluster0.fkbxa.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupCollection = db.collection("meetups");

  // Will find all documents in there and fetch it.
  const meetupData = await meetupCollection.find().toArray();

  client.close();
  return {
    // This is the data that gets passed to the component automatically
    props: {
      meetups: meetupData.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        // To convert the strange ID from mongoDB
        id: meetup._id.toString(),
      })),
    },

    // Through this property, nextJS doesn't just load data once, but checks for a server request (when database changes) every 10 secs and if there is a request, it re-evaluates the data and updates it.
    revalidate: 10,
  };
};

export default HomePage;
