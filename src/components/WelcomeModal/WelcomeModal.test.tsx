import { MockedProvider } from "@apollo/client/testing";
import { render, waitFor } from "test_utils";
import WelcomeModal from "./WelcomeModal";

describe("welcomeModal", () => {
  beforeEach(() => {
    Object.defineProperty(global.window.HTMLMediaElement.prototype, "play", {
      configurable: true,
      // Define the property getter
      get() {
        setTimeout(() => this.onloadeddata && this.onloadeddata());
        return () => {};
      },
    });
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("displays an image", () => {
    const { queryByDataCy } = render(
      <MockedProvider>
        <WelcomeModal
          carouselCards={[
            {
              title: "Slide 1",
              subtitle: "A Subtitle",
              description: "A Description 1",
              img: "test_img/logo.png",
              alt: "evg-logo",
            },
          ]}
          param="spruceV1"
        />
      </MockedProvider>
    );

    expect(queryByDataCy("carousel-image")).toBeVisible();
  });
  // mock video play function
  it("displays an video on a video slide", () => {
    const { queryByDataCy } = render(
      <MockedProvider>
        <WelcomeModal
          carouselCards={[
            {
              title: "Slide 1",
              subtitle: "A Subtitle",
              description: "A Description 1",
              video: "test_img/video.webm",
            },
          ]}
          param="spruceV1"
        />
      </MockedProvider>
    );
    expect(queryByDataCy("carousel-video")).toBeVisible();
  });
  it("clicking the pagination buttons change the slides", async () => {
    const { getByText, queryByDataCy } = render(
      <MockedProvider>
        <WelcomeModal
          carouselCards={[
            {
              title: "Slide 1",
              subtitle: "A Subtitle",
              description: "A Description 1",
              img: "test_img/logo.png",
            },
            {
              title: "Slide 2",
              description: "A Description 2",
              img: "test_img/logo.png",
            },
          ]}
          param="spruceV1"
        />
      </MockedProvider>
    );
    expect(getByText("Slide 1")).toBeVisible();
    expect(queryByDataCy("carousel-dot-1")).toBeVisible();
    queryByDataCy("carousel-dot-1").click();
    await waitFor(() => {
      expect(getByText("Slide 2")).toBeVisible();
    });
    queryByDataCy("carousel-dot-0").click();
    await waitFor(() => {
      expect(getByText("Slide 1")).toBeVisible();
    });
  });
});
