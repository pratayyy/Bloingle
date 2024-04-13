import AnimationWrapper from "../common/AnimationWrapper";
import InPageNavigation from "../components/InPageNavigation";

const Homepage = () => {
  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* latest blogs */}
        <div className="w-full">
          <InPageNavigation
            routes={["home", "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            <h1>Latest Blogs here</h1>

            <h1>Trending blogs here</h1>
          </InPageNavigation>
        </div>

        {/* filters and trending blog */}
        <div></div>
      </section>
    </AnimationWrapper>
  );
};

export default Homepage;
