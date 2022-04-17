import { MongoClient, ObjectId } from "mongodb";
import { useRouter } from "next/router";
import Head from "next/head";
import { Fragment } from "react";
import MeetupDetail from "../../components/meetups/MeetupDetail";

const MeetupDetails = (props) => {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
};

// Needed ONLY when you're using getStaticProps and a dynamic path (not needed with getServerSideProps)
export const getStaticPaths = async () => {
  // Since, this page gets rendered in the build process, nextJS needs to build this page for EVERY ID, it needs to generate the page for every outcome. So here, we need to provide it a list of IDs that are visitable.
  const client = await MongoClient.connect(
    "mongodb+srv://john-shepard:john1706@cluster0.fkbxa.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupCollection = db.collection("meetups");
  // Filter criteria           (get all values v), (v get only id)
  const meetups = await meetupCollection.find({}, { _id: 1 }).toArray();
  client.close();
  const paths = meetups.map((meetup) => ({
    params: {
      meetupId: meetup._id.toString(),
    },
  }));
  console.log(paths);

  return {
    // This parameter tells nextJS, if all possible paths are mentioned in paths array or just some of them. If false then you've mentioned ALL possible paths and vice versa. If true then nextJS tries to build the page not mentioned here, like the other ones here, for that you need to define router.isFallback so that it shows that message while fetching/loading, otherwise nextJS does not get any time for fetching. If false then user gets a 404 page if tries to visit any other page.
    // paths: [
    //   {
    //     params: {
    //       // We have only one param here, meetupID, if we have multiple then write multiple params here
    //       meetupId: "m1",
    //     },
    //   },
    //   {
    //     params: {
    //       meetupId: "m2",
    //     },
    //   },
    // ],
    paths: paths,
    fallback: true,
  };
};

export const getStaticProps = async (context) => {
  // In getStaticProps, context does not have request or response, but has params where we can access the meetupId
  const meetupId = context.params.meetupId;
  const client = await MongoClient.connect(
    "mongodb+srv://john-shepard:john1706@cluster0.fkbxa.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupCollection = db.collection("meetups");
  // Filter criteria           (get all values v), (v get only id)
  const selectedMeetup = await meetupCollection.findOne({
    _id: ObjectId(meetupId),
  });
  client.close();
  console.log(meetupId, selectedMeetup);

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
};
export default MeetupDetails;
